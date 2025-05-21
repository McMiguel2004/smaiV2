from flask import jsonify, current_app
from ..utils import get_authenticated_user_id
from ..models import Server

def show_servers():
    """Shows all servers for the authenticated user."""
    try:
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': "User not authenticated"}), 401

        servers = Server.query.filter_by(user_id=user_id).all()
        result = [{
            'id': s.id,
            'name': s.name,
            'software': s.software,
            'version': s.version,
            'curseforge_modpack_url': s.curseforge_modpack_url,
            'ip_address': s.ip_address,
            'container_id': s.container_id,
            'port': s.port,
            'status': s.status
        } for s in servers]

        return jsonify({'success': True, 'servers': result}), 200

    except Exception as e:
        current_app.logger.exception("Error getting servers")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
