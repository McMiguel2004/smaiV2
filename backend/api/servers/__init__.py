from flask import Blueprint

servers_bp = Blueprint('servers', __name__, url_prefix='/api/servers')

# Import all routes
from .routes import (
    create_server, show_servers, delete_server, 
    start_server, stop_server, restart_server,
    server_terminal, server_status, server_command,
    upload_file, server_startup_status
)

# Register routes with the blueprint
servers_bp.add_url_rule('/Create_Server', view_func=create_server.create_server, methods=['POST'])
servers_bp.add_url_rule('/show_servers', view_func=show_servers.show_servers, methods=['GET'])
servers_bp.add_url_rule('/delete_server/<int:server_id>', view_func=delete_server.delete_server, methods=['DELETE'])
servers_bp.add_url_rule('/Start_Server/<int:server_id>', view_func=start_server.start_server, methods=['POST'])
servers_bp.add_url_rule('/stop_server/<int:server_id>', view_func=stop_server.stop_server, methods=['POST'])
servers_bp.add_url_rule('/restart_server/<int:server_id>', view_func=restart_server.restart_server, methods=['POST'])
servers_bp.add_url_rule('/server_terminal/<int:server_id>', view_func=server_terminal.server_terminal)
servers_bp.add_url_rule('/server_status/<int:server_id>', view_func=server_status.server_status, methods=['GET'])
servers_bp.add_url_rule('/server_startup_status/<int:server_id>', view_func=server_startup_status.server_startup_status, methods=['GET'])
servers_bp.add_url_rule('/server_command/<int:server_id>', view_func=server_command.server_command, methods=['POST'])
servers_bp.add_url_rule('/upfile', view_func=upload_file.upload_file, methods=['POST'])

__all__ = ['servers_bp']
