import subprocess
from flask import request, jsonify, current_app
from ..utils import get_authenticated_user_id
from ..models import Server

def server_command(server_id):
    """
    Sends a command to the Minecraft server via RCON and returns the response.
    """
    try:
        # 1. Verify authentication
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'User not authenticated'}), 401

        # 2. Verify if the server exists and belongs to the user
        server = Server.query.filter_by(id=server_id, user_id=user_id).first()
        if not server:
            return jsonify({'success': False, 'message': 'Server not found'}), 404

        # 3. Verify that the server has a Docker container assigned and is running
        if not server.container_id:
            return jsonify({'success': False, 'message': 'Container not associated with server'}), 400
            
        if server.status != 'Activo':
            return jsonify({'success': False, 'message': 'Server is not running'}), 400

        # 4. Get the command from the request
        data = request.get_json()
        if not data or 'command' not in data:
            return jsonify({'success': False, 'message': 'No command provided'}), 400
            
        command = data['command'].strip()
        if not command:
            return jsonify({'success': False, 'message': 'Empty command'}), 400

        # 5. Execute the command using rcon-cli
        cmd = [
            'sudo', 'docker', 'exec', server.container_id,
            'rcon-cli', command
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        # Check for errors
        if result.returncode != 0:
            current_app.logger.error(f"Command execution failed: {result.stderr}")
            
            # Try alternative method if RCON fails
            alt_cmd = [
                'sudo', 'docker', 'exec', server.container_id,
                'mc-send-to-console', command
            ]
            
            alt_result = subprocess.run(alt_cmd, capture_output=True, text=True)
            
            if alt_result.returncode != 0:
                return jsonify({
                    'success': False, 
                    'message': 'Failed to execute command',
                    'error': alt_result.stderr
                }), 500
            
            return jsonify({
                'success': True,
                'response': 'Command sent successfully (no response available)'
            })
        
        # 6. Return the command response
        return jsonify({
            'success': True,
            'response': result.stdout,
            'command': command
        })
        
    except Exception as e:
        current_app.logger.exception(f"Error executing command: {e}")
        return jsonify({'success': False, 'message': f'Internal server error: {str(e)}'}), 500
