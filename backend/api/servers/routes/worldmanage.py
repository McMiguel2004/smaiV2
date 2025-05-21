# backend/routes/worldmanage.py

import subprocess
import os
import tempfile
from flask import jsonify, request, current_app
from .. import servers_bp as bp
from ..utils import get_authenticated_user_id
from ..models import Server

@bp.route('/<int:server_id>/world/import', methods=['POST'])
def import_world(server_id):
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify(success=False, message="No autenticado"), 401

    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify(success=False, message="Servidor no encontrado"), 404

    if 'worldArchive' not in request.files:
        return jsonify(success=False, message="Falta archivo de world"), 400

    archive = request.files['worldArchive']
    tmp = tempfile.mkdtemp()
    local_path = os.path.join(tmp, archive.filename)
    archive.save(local_path)

    container = server.container_id
    remote_archive = f"/data/{archive.filename}"

    try:
        # Subir archivo al contenedor
        with open(local_path, 'rb') as f:
            subprocess.run(
                ['sudo', 'docker', 'exec', '-i', container,
                 'sh', '-c', f'cat > {remote_archive}'],
                input=f.read(),
                check=True,
                capture_output=True
            )

        # Extraer y corregir doble carpeta usando --strip-components=1
        subprocess.run([
            'sudo', 'docker', 'exec', container, 'sh', '-c',
            f'rm -rf /data/world && mkdir -p /data/world && '
            f'tar xzf {remote_archive} -C /data/world --strip-components=1 && '
            'chown -R 1000:1000 /data/world'
        ], check=True, capture_output=True, text=True)

        # Borrar el archivo comprimido dentro del contenedor
        subprocess.run(
            ['sudo', 'docker', 'exec', container, 'rm', remote_archive],
            check=True, capture_output=True, text=True
        )

        # Reiniciar el contenedor para aplicar cambios
        subprocess.run(
            ['sudo', 'docker', 'restart', container],
            check=True, capture_output=True, text=True
        )

    except subprocess.CalledProcessError as e:
        stderr = (e.stderr or b"").decode().strip()
        current_app.logger.error("Import error (world import): %s", stderr)
        return jsonify(success=False, message="Error importando World", detail=stderr), 500

    finally:
        if os.path.exists(local_path):
            os.remove(local_path)
        os.rmdir(tmp)

    return jsonify(success=True, message="World importado correctamente"), 200


@bp.route('/<int:server_id>/world/export', methods=['GET'])
def export_world(server_id):
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify(success=False, message="No autenticado"), 401

    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify(success=False, message="Servidor no encontrado"), 404

    container = server.container_id
    tmp = tempfile.mkdtemp()
    out_tar = os.path.join(tmp, "world_export.tar.gz")

    try:
        subprocess.run(
            ['sudo', 'docker', 'exec', container, 'sh', '-c',
             'cd /data && rm -f world_export.tar.gz && tar czf /data/world_export.tar.gz world && chown 1000:1000 /data/world_export.tar.gz'],
            check=True,
            capture_output=True,
            text=True
        )

        with open(out_tar, 'wb') as f:
            subprocess.run(
                ['sudo', 'docker', 'exec', '-i', container,
                 'sh', '-c', 'cat /data/world_export.tar.gz'],
                check=True,
                stdout=f,
                stderr=subprocess.PIPE
            )

    except subprocess.CalledProcessError as e:
        err = (e.stderr or b"").decode().strip()
        current_app.logger.error("Export error (world export): %s", err)
        return jsonify(success=False, message="Error exportando World", detail=err), 500

    try:
        subprocess.run(
            ['sudo', 'docker', 'exec', container, 'rm', '/data/world_export.tar.gz'],
            check=True, capture_output=True, text=True
        )
    except subprocess.CalledProcessError:
        pass

    try:
        with open(out_tar, 'rb') as f:
            data = f.read()
    finally:
        if os.path.exists(out_tar):
            os.remove(out_tar)
        if os.path.isdir(tmp):
            os.rmdir(tmp)

    return current_app.response_class(data, mimetype='application/gzip')


@bp.route('/<int:server_id>/world', methods=['DELETE'])
def delete_world(server_id):
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify(success=False, message="No autenticado"), 401

    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify(success=False, message="Servidor no encontrado"), 404

    container = server.container_id
    try:
        subprocess.run(['sudo', 'docker', 'exec', container, 'rm', '-rf', '/data/world'],
                       check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        current_app.logger.error("Delete error: %s", e.stderr.decode())
        return jsonify(success=False, message="Error eliminando World"), 500

    return jsonify(success=True, message="World eliminado"), 200
