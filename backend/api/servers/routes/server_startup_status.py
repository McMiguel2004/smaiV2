import subprocess
from datetime import datetime
from flask import jsonify, current_app
from ..utils import get_authenticated_user_id
from ..models import Server

def server_startup_status(server_id):
    """
    Gets detailed startup status of a server, including logs analysis.
    """
    try:
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'User not authenticated'}), 401

        server = Server.query.filter_by(id=server_id, user_id=user_id).first()
        if not server:
            return jsonify({'success': False, 'message': 'Server not found'}), 404

        if not server.container_id or server.status != 'Activo':
            return jsonify({
                'success': True, 
                'status': server.status,
                'ready': False,
                'progress': 0,
                'message': 'Server is not running'
            }), 200

        # Get logs to analyze startup progress
        cmd = [
            'sudo', 'docker', 'logs',
            server.container_id
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        logs = result.stdout
        
        # Analyze logs for startup progress
        startup_stages = {
            'java': [
                {'pattern': 'Starting minecraft server', 'progress': 10, 'message': 'Iniciando servidor'},
                {'pattern': 'Loading properties', 'progress': 20, 'message': 'Cargando propiedades'},
                {'pattern': 'Preparing level', 'progress': 40, 'message': 'Preparando nivel'},
                {'pattern': 'Preparing start region', 'progress': 60, 'message': 'Preparando región inicial'},
                {'pattern': 'Done', 'progress': 100, 'message': 'Servidor listo'}
            ],
            'forge': [
                {'pattern': 'Starting minecraft server', 'progress': 5, 'message': 'Iniciando servidor'},
                {'pattern': 'Loading properties', 'progress': 10, 'message': 'Cargando propiedades'},
                {'pattern': 'Forge Mod Loader', 'progress': 20, 'message': 'Cargando Forge'},
                {'pattern': 'Loading mods', 'progress': 30, 'message': 'Cargando mods'},
                {'pattern': 'Applying Forge', 'progress': 50, 'message': 'Aplicando Forge'},
                {'pattern': 'Preparing level', 'progress': 70, 'message': 'Preparando nivel'},
                {'pattern': 'Preparing start region', 'progress': 85, 'message': 'Preparando región inicial'},
                {'pattern': 'Done', 'progress': 100, 'message': 'Servidor listo'}
            ],
            'fabric': [
                {'pattern': 'Starting minecraft server', 'progress': 5, 'message': 'Iniciando servidor'},
                {'pattern': 'Loading properties', 'progress': 10, 'message': 'Cargando propiedades'},
                {'pattern': 'Loading Fabric', 'progress': 20, 'message': 'Cargando Fabric'},
                {'pattern': 'Loading mods', 'progress': 40, 'message': 'Cargando mods'},
                {'pattern': 'Preparing level', 'progress': 70, 'message': 'Preparando nivel'},
                {'pattern': 'Preparing start region', 'progress': 85, 'message': 'Preparando región inicial'},
                {'pattern': 'Done', 'progress': 100, 'message': 'Servidor listo'}
            ],
            'modpack': [
                {'pattern': 'Starting minecraft server', 'progress': 5, 'message': 'Iniciando servidor'},
                {'pattern': 'Loading properties', 'progress': 10, 'message': 'Cargando propiedades'},
                {'pattern': 'Loading modpack', 'progress': 15, 'message': 'Cargando modpack'},
                {'pattern': 'Downloading mods', 'progress': 25, 'message': 'Descargando mods'},
                {'pattern': 'Loading mods', 'progress': 40, 'message': 'Cargando mods'},
                {'pattern': 'Initializing mods', 'progress': 60, 'message': 'Inicializando mods'},
                {'pattern': 'Preparing level', 'progress': 75, 'message': 'Preparando nivel'},
                {'pattern': 'Preparing start region', 'progress': 90, 'message': 'Preparando región inicial'},
                {'pattern': 'Done', 'progress': 100, 'message': 'Servidor listo'}
            ]
        }
        
        # Determine server type for progress tracking
        server_type = server.software.lower()
        if server_type not in startup_stages:
            server_type = 'java'  # Default to Java if unknown type
            
        # Find the highest progress stage reached
        current_progress = 0
        current_message = 'Iniciando servidor'
        
        for stage in startup_stages[server_type]:
            if stage['pattern'] in logs:
                current_progress = stage['progress']
                current_message = stage['message']
                
        # Check if server is fully ready
        ready = 'Done' in logs and 'For help, type "help"' in logs
        
        # If no progress detected but server is running, calculate based on time
        if current_progress == 0 and server.status == 'Activo':
            # Determine startup time based on server type
            startup_time = 60  # Default: 60 seconds (Java)
            if server_type == 'forge' or server_type == 'fabric':
                startup_time = 90  # 1.5 minutes
            elif server_type == 'modpack':
                startup_time = 120  # 2 minutes
                
            # Get container creation time
            cmd_inspect = [
                'sudo', 'docker', 'inspect',
                '--format', '{{.Created}}',
                server.container_id
            ]
            
            inspect_result = subprocess.run(cmd_inspect, capture_output=True, text=True)
            created_str = inspect_result.stdout.strip()
            
            # Parse creation time and calculate elapsed time
            try:
                created_time = datetime.fromisoformat(created_str.replace('Z', '+00:00'))
                elapsed_seconds = (datetime.now().astimezone() - created_time).total_seconds()
                current_progress = min(100, int((elapsed_seconds / startup_time) * 100))
            except Exception:
                current_progress = 5  # Default minimal progress
        
        return jsonify({
            'success': True,
            'status': server.status,
            'ready': ready,
            'progress': current_progress,
            'message': current_message,
            'server_type': server_type
        }), 200
            
    except Exception as e:
        current_app.logger.exception("Error getting server startup status")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
