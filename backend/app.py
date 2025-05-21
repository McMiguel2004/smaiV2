import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.auth.models import db
from api.auth import auth_bp
from api.servers import servers_bp
from api.wireguard import wireguard_bp  # Import the new blueprint
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # JWT Configuration
    app.config['JWT_SECRET_KEY'] = 'Smai'  # Make sure to use a strong secret key
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    app.config['PROPAGATE_EXCEPTIONS'] = True

    # Initialize JWTManager
    jwt = JWTManager(app)

    # Stricter CORS configuration
    CORS(app, resources={ 
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Authorization"],
            "supports_credentials": True,
            "max_age": 86400
        }
    })
    
    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = Config.DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True
    }
    
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(servers_bp)
    app.register_blueprint(wireguard_bp)  # Register the new blueprint

    # Create tables if they don't exist
    with app.app_context():
        db.create_all()

    # Create directory for uploaded files
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
