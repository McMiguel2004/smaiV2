import subprocess
from datetime import datetime
from flask import jsonify, current_app
from ..utils import get_authenticated_user_id
from ..models import Server

def server_status(server_id):
    """
    Gets the current status of a server, including startup progress.
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
                'message': 'Server is not running'
            }), 200

        # Check if server is ready by looking at logs
        cmd = [
            'sudo', 'docker', 'logs',
            '--tail', '50',
            server.container_id
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        logs = result.stdout
        
        # Check if server is ready based on log content
        ready = 'Done' in logs and 'For help, type "help"' in logs
        
        # Determine startup progress based on server type
        startup_time = 60  # Default: 60 seconds (Java)
        if server.software.lower() == 'forge' or server.software.lower() == 'fabric':
            startup_time = 90  # 1.5 minutes
        elif server.software.lower() == 'modpack':
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
            progress = min(100, int((elapsed_seconds / startup_time) * 100))
        except Exception:
            progress = 0
            
        return jsonify({
            'success': True,
            'status': server.status,
            'ready': ready,
            'progress': progress,
            'startup_time': startup_time,
            'message': 'Server is starting up' if not ready else 'Server is ready'
        }), 200
            
    except Exception as e:
        current_app.logger.exception("Error getting server status")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
