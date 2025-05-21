import subprocess
from flask import jsonify, current_app
from ..utils import get_authenticated_user_id
from ..models import Server

def restart_server(server_id):
    """
    Restarts a Docker container associated with the server.
    """
    try:
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'User not authenticated'}), 401

        server = Server.query.filter_by(id=server_id, user_id=user_id).first()
        if not server:
            return jsonify({'success': False, 'message': 'Server not found'}), 404

        if server.container_id:
            subprocess.run(['sudo', 'docker', 'restart', server.container_id], check=False)

        current_app.logger.info(f"Server {server_id} restarted by user {user_id}")
        return jsonify({'success': True, 'message': 'Server restarted successfully'}), 200

    except Exception as e:
        current_app.logger.exception("Error restarting server")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
