import requests
from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from ..servers.models import Server

def get_authenticated_user_id():
    """Gets the authenticated user ID from cookies."""
    try:
        response = requests.get(f"{request.host_url}api/auth/me", cookies=request.cookies)
        if response.status_code == 200:
            return response.json().get('id')
    except Exception as e:
        current_app.logger.exception("Error authenticating user")
    return None

def server_owner_required(f):
    @wraps(f)
    def decorated_function(server_id, *args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        
        server = Server.query.filter_by(
            id=server_id, 
            user_id=current_user_id
        ).first()
        
        if not server:
            return jsonify({
                'success': False, 
                'message': 'Servidor no encontrado o no autorizado'
            }), 404
            
        return f(server_id, *args, **kwargs)
    return decorated_function
