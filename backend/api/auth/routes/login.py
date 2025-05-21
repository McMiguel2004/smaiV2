from flask import request, jsonify
from ..models import db, User
from config import Config

def login():
    """
    Login a user and generate tokens
    """
    data = request.get_json()
    
    if not data or not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Missing email or password'}), 400
        
    email = data['email'].strip().lower()
    password = data['password']
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    try:
        # Generate tokens
        session_token = user.generate_session_token()
        jwt_token = user.generate_jwt()
        
        db.session.commit()
        
        # Create response
        response = jsonify({
            'message': 'Logged in successfully',
            'user': user.to_dict(),
            'access_token': jwt_token,
            'refresh_token': session_token
        })
        
        # Configure secure cookies
        response.set_cookie(
            'access_token',
            f'Bearer {jwt_token}',
            httponly=True,
            secure=False,  # Set to True in production
            samesite=Config.COOKIE_SAMESITE,
            max_age=Config.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
        response.set_cookie(
            'refresh_token',
            session_token,
            httponly=True,
            secure=False,  # Set to True in production
            samesite=Config.COOKIE_SAMESITE,
            max_age=Config.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        )
        
        return response
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500
