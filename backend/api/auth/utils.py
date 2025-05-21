import requests
from functools import wraps
from flask import request, jsonify, current_app
from .models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # First, try to get the token from the Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        # If no token in the header, try to get it from the "access_token" cookie
        if not token:
            cookie_token = request.cookies.get('access_token')
            if cookie_token:
                if cookie_token.startswith('Bearer '):
                    token = cookie_token.split(" ")[1]
                else:
                    token = cookie_token
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        user = User.verify_jwt(token)
        if not user:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        
        return f(user, *args, **kwargs)
    return decorated
