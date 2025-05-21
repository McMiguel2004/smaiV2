import os
import pathlib
import subprocess
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
from ..utils import get_authenticated_user_id
from ..models import Server

def upload_file():
    """
    Receives a file and a serverId, saves it temporarily on disk,
    copies it to the corresponding Docker container and deletes it from the host.
    """
    try:
        # 1. Authentication
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'User not authenticated'}), 401

        # 2. Get file and serverId
        if 'archivo' not in request.files or 'servidorId' not in request.form:
            return jsonify({'success': False, 'message': 'Incomplete data'}), 400

        archivo = request.files['archivo']
        servidor_id = int(request.form['servidorId'])

        # 3. Validate name
        if archivo.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'}), 400

        # 4. Find server in DB
        server = Server.query.filter_by(id=servidor_id, user_id=user_id).first()
        if not server or not server.container_id:
            return jsonify({'success': False, 'message': 'Server not found or no container'}), 404

        software = server.software.lower()

        # 5. Directories based on software (local within backend/)
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
        if software in ('forge', 'fabric', 'modpack'):
            host_dir = os.path.join(base, 'mods')
            cont_dir = '/data/mods'
        elif software in ('spigot', 'bukkit'):
            host_dir = os.path.join(base, 'plugins')
            cont_dir = '/data/plugins'
        else:
            return jsonify({'success': False, 'message': 'Incompatible software'}), 400

        # 6. Create directory if it doesn't exist
        pathlib.Path(host_dir).mkdir(parents=True, exist_ok=True)

        # 7. Save file on host
        filename = secure_filename(archivo.filename)
        host_path = os.path.join(host_dir, filename)
        archivo.save(host_path)

        # 8. Copy to Docker container
        cmd = [
            'sudo', 'docker', 'cp',
            host_path,
            f"{server.container_id}:{cont_dir}/{filename}"
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)

        # 9. Delete temporary file
        os.remove(host_path)

        if result.returncode != 0:
            current_app.logger.error("Docker cp error: %s", result.stderr.strip())
            return jsonify({
                'success': False,
                'message': 'Error sending to container: ' + result.stderr.strip()
            }), 500

        return jsonify({
            'success': True,
            'message': 'File uploaded successfully. Restart the server to apply changes.'
        }), 200

    except Exception as e:
        current_app.logger.exception("Error in /upfile")
        return jsonify({'success': False, 'message': str(e)}), 500
