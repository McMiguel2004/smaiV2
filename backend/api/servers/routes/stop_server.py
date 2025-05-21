import subprocess
from flask import jsonify, current_app
from ..utils import get_authenticated_user_id
from ..models import db, Server

def stop_server(server_id):
    """
    Stops a Docker container associated with the server and updates its status.
    """
    try:
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'User not authenticated'}), 401

        server = Server.query.filter_by(id=server_id, user_id=user_id).first()
        if not server or not server.container_id:
            return jsonify({'success': False, 'message': 'Server not found or no container'}), 404

        # Use sudo to stop the container (sudoers allows without password)
        subprocess.run(['sudo', 'docker', 'stop', server.container_id], check=False)

        server.status = 'Detenido'
        db.session.commit()

        current_app.logger.info(f"Server {server_id} stopped by user {user_id}")
        return jsonify({'success': True, 'message': 'Server stopped successfully'}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception('Error stopping server')
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
