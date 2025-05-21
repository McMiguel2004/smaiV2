from flask import request, jsonify
import re
from ..models import db, User
from ...wireguard.utils import generate_wireguard_keys, get_next_available_ip, create_client_config, update_server_config
from ...wireguard.models import WireguardConfig

# Server configuration constants
SERVER_PUBLIC_KEY = "jwmkYl51tCQ6e5iyhfor5rYb5bnak8QQZemV7ka8QiI="  # Your server's public key
SERVER_ENDPOINT = "smai.duckdns.org:51821"  # Your server's public endpoint

# Regular expressions for validation
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
USERNAME_REGEX = re.compile(r'^[a-zA-Z0-9_]{3,20}$')
PASSWORD_REGEX = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$')

def register():
    """
    Register a new user and generate WireGuard configuration
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
        # Create user
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.flush()  # Flush to get the user ID
        
        # Generate WireGuard keys
        private_key, public_key = generate_wireguard_keys()
        if not private_key or not public_key:
            raise Exception("Failed to generate WireGuard keys")
        
        # Get next available IP
        client_ip = get_next_available_ip(new_user.id)
        if not client_ip:
            raise Exception("No available IP addresses")
        
        # Create client configuration
        client_config = create_client_config(
            private_key=private_key,
            client_ip=client_ip,
            server_public_key=SERVER_PUBLIC_KEY,
            server_endpoint=SERVER_ENDPOINT
        )
        
        # Update server configuration
        if not update_server_config(public_key, client_ip):
            raise Exception("Failed to update server configuration")
        
        # Save configuration to database
        new_config = WireguardConfig(
            user_id=new_user.id,
            wireguard_conf=client_config,
            wireguard_public_key=public_key,
            wireguard_private_key=private_key,
            wireguard_ip=client_ip
        )
        
        db.session.add(new_config)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': new_user.to_dict(),
            'wireguard': {
                'ip': client_ip,
                'config_available': True
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500
