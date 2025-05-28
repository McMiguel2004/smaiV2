from flask import request, jsonify
import re
from ..models import db, User

# Regular expressions for validation
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
USERNAME_REGEX = re.compile(r'^[a-zA-Z0-9_]{3,20}$')
PASSWORD_REGEX = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$')

def register():
    """
    Register a new user
    """
    data = request.get_json()
   
    # Field validation
    if not data or not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
       
    username = data['username'].strip()
    email = data['email'].strip().lower()
    password = data['password']
   
    # Validations
    if not USERNAME_REGEX.match(username):
        return jsonify({'error': 'Invalid username format'}), 400
       
    if not EMAIL_REGEX.match(email):
        return jsonify({'error': 'Invalid email format'}), 400
       
    if not PASSWORD_REGEX.match(password):
        return jsonify({'error': 'Password must be at least 8 characters with letters and numbers'}), 400
       
    # Check uniqueness
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409
       
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409
       
    try:
        new_user = User(username=username, email=email)
        new_user.set_password(password)
       
        db.session.add(new_user)
        db.session.commit()
       
        return jsonify({
            'message': 'User registered successfully',
            'user': new_user.to_dict()
        }), 201
       
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500


	
