import subprocess
from flask import jsonify, current_app
from ..utils import get_authenticated_user_id
from ..models import db, Server

def delete_server(server_id):
    """Deletes a server if it belongs to the authenticated user and its Docker container."""
    try:
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': "User not authenticated"}), 401

        server = Server.query.filter_by(id=server_id, user_id=user_id).first()
        if not server:
            return jsonify({'success': False, 'message': 'Server not found or not authorized'}), 404

        # Save container ID before deleting the server
        container_id = server.container_id

        # Delete from database (properties + server)
        db.session.delete(server)
        db.session.commit()

        # Stop and remove Docker container if it exists
        if container_id:
            subprocess.run(["sudo", "docker", "rm", "-f", container_id], check=False)

        # Remove unused volumes (general, not just for this container)
        subprocess.run(["sudo", "docker", "volume", "prune", "-f"], check=False)

        current_app.logger.info(f"Server {server_id} and container {container_id} deleted by user {user_id}")
        return jsonify({'success': True, 'message': 'Server deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Error deleting server")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
