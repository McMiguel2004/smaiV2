from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

# Import all routes
from .routes import register, login, refresh, logout, me

# Register routes with the blueprint
auth_bp.add_url_rule('/register', view_func=register.register, methods=['POST'])
auth_bp.add_url_rule('/login', view_func=login.login, methods=['POST'])
auth_bp.add_url_rule('/refresh', view_func=refresh.refresh, methods=['POST'])
auth_bp.add_url_rule('/logout', view_func=logout.logout, methods=['POST'])
auth_bp.add_url_rule('/me', view_func=me.get_current_user, methods=['GET'])

__all__ = ['auth_bp']
