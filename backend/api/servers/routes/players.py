import subprocess
from flask import jsonify
from .. import servers_bp as bp
from ..utils import get_authenticated_user_id
from ..models import Server

@bp.route('/<int:server_id>/players', methods=['GET'])
def list_players(server_id):
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify(success=False, message='Usuario no autenticado'), 401

    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify(success=False, message='Servidor no encontrado o no autorizado'), 404

    container = server.container_id
    if not container:
        return jsonify(success=False, message='Contenedor no iniciado'), 400

    # Comando para listar jugadores activos
    try:
        active_result = subprocess.run(
            ['sudo', 'docker', 'exec', container, 'cat', '/data/active_players.txt'],
            capture_output=True, text=True
        )
        banned_result = subprocess.run(
            ['sudo', 'docker', 'exec', container, 'cat', '/data/banned_players.txt'],
            capture_output=True, text=True
        )

        if active_result.returncode != 0:
            raise Exception("No se pudo leer jugadores activos")
        if banned_result.returncode != 0:
            raise Exception("No se pudo leer jugadores baneados")

        active_players = active_result.stdout.strip().splitlines()
        banned_players = banned_result.stdout.strip().splitlines()

        return jsonify(success=True, active=active_players, banned=banned_players), 200

    except Exception as e:
        return jsonify(success=False, message=str(e)), 500
