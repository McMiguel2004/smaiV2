from flask import request, jsonify
from ..models import db, User
from config import Config

def refresh():
    """
    Refresh access token using refresh token
    """
    refresh_token = request.cookies.get('refresh_token')
    
    if not refresh_token:
        return jsonify({'error': 'Refresh token is missing'}), 401
        
    user = User.verify_session_token(refresh_token)
    if not user:
        return jsonify({'error': 'Invalid refresh token'}), 401
        
    try:
        # Generate new tokens
        new_jwt = user.generate_jwt()
        new_refresh = user.generate_session_token()
        
        db.session.commit()
        
        # Create response
        response = jsonify({
            'message': 'Token refreshed successfully',
            'access_token': new_jwt,
            'refresh_token': new_refresh
        })
        
        # Update cookies
        response.set_cookie(
            'access_token',
            f'Bearer {new_jwt}',
            httponly=True,
            secure=Config.COOKIE_SECURE,
            samesite=Config.COOKIE_SAMESITE,
            max_age=Config.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
        response.set_cookie(
            'refresh_token',
            new_refresh,
            httponly=True,
            secure=Config.COOKIE_SECURE,
            samesite=Config.COOKIE_SAMESITE,
            max_age=Config.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        )
        
        return response
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500
