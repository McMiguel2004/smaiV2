from flask import Blueprint

wireguard_bp = Blueprint('wireguard', __name__, url_prefix='/api/wireguard')

# Import all routes
from .routes import generate_config, download_config

# Register routes with the blueprint
wireguard_bp.add_url_rule('/generate', view_func=generate_config.generate_config, methods=['POST'])
wireguard_bp.add_url_rule('/download', view_func=download_config.download_config, methods=['GET'])

__all__ = ['wireguard_bp']
