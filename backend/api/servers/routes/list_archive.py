import subprocess
from flask import jsonify, request, current_app
from .. import servers_bp as bp
from ..utils import get_authenticated_user_id
from ..models import Server
import os
import time

@bp.route('/<int:server_id>/files', methods=['GET'])
def list_archive(server_id):
    """
    Lista ficheros y carpetas de un directorio dentro del contenedor Docker.
    Devuelve JSON { success, path, files: [{name, type}, …] }
    """
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify(success=False, message='Usuario no autenticado'), 401

    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify(success=False, message='Servidor no encontrado o no autorizado'), 404

    container = server.container_id
    if not container:
        return jsonify(success=False, message='Contenedor no iniciado'), 400

    path = request.args.get('path', '/data')

    # Comprobamos que el contenedor existe
    check = subprocess.run(
        ['sudo', 'docker', 'ps', '-a', '--filter', f'id={container}', '-q'],
        capture_output=True, text=True
    )
    if check.returncode != 0 or not check.stdout.strip():
        return jsonify(success=False, message=f'Contenedor {container} no existe'), 404

    # Listamos dirs vs files
    cmd = [
        'sudo', 'docker', 'exec', container, 'sh', '-c',
        f'''
          cd "{path}" 2>/dev/null || exit 1
          for f in * .?*; do
            [ -e "$f" ] || continue
            if [ -d "$f" ]; then
              printf "dir:%s\\n" "$f"
            else
              printf "file:%s\\n" "$f"
            fi
          done
        '''
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        current_app.logger.error("list_archive error: %s", result.stderr.strip())
        return jsonify(success=False, message='No se pudo listar el directorio, asegurese de que el servidor este activo.',
                       error=result.stderr.strip()), 500

    files = []
    for line in result.stdout.splitlines():
        kind, name = line.split(':', 1)
        files.append({'name': name, 'type': kind})  # kind: "dir" o "file"

    return jsonify(success=True, path=path, files=files), 200







@bp.route('/<int:server_id>/file-content', methods=['GET'])
def file_content(server_id):
    """
    Devuelve el contenido de un fichero dentro del contenedor Docker.
    GET-params:
      - path: ruta completa del fichero dentro del contenedor.
    """
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify(success=False, message='Usuario no autenticado'), 401

    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify(success=False, message='Servidor no encontrado o no autorizado'), 404

    container = server.container_id
    if not container:
        return jsonify(success=False, message='Contenedor no iniciado'), 400

    file_path = request.args.get('path')
    if not file_path:
        return jsonify(success=False, message='No se proporcionó la ruta del fichero'), 400

    # Ejecutar cat
    result = subprocess.run(
        ['sudo', 'docker', 'exec', container, 'cat', file_path],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        current_app.logger.error("file_content error: %s", result.stderr.strip())
        return jsonify(success=False, message='No se pudo leer el fichero', error=result.stderr.strip()), 500

    return jsonify(success=True, content=result.stdout), 200




@bp.route('/<int:server_id>/file-content', methods=['POST'])
def update_file_content(server_id):
    data = request.get_json()
    content = data.get('content')
    file_path = data.get('path')  # Ruta absoluta dentro del contenedor

    if content is None or not file_path:
        return jsonify({'message': 'Faltan parámetros', 'success': False}), 400

    # Obtener el contenedor asociado al server_id
    server = Server.query.filter_by(id=server_id).first()

    if not server:
        return jsonify({'message': 'Servidor no encontrado', 'success': False}), 404

    container_id = server.container_id  # Asumiendo que el contenedor se guarda aquí

    if not container_id:
        return jsonify({'message': 'Contenedor no encontrado o no está en ejecución.', 'success': False}), 404

    # Crear archivo temporal en un directorio específico
    filename = os.path.basename(file_path)
    tmp_path = f"./temp/{server_id}_{filename}"

    try:
        # Crear el directorio temporal si no existe
        os.makedirs(os.path.dirname(tmp_path), exist_ok=True)

        # Escribir el contenido en el archivo temporal
        with open(tmp_path, 'w') as f:
            f.write(content)

        # Verificar que el archivo temporal realmente se haya creado
        if not os.path.exists(tmp_path):
            raise Exception(f"El archivo temporal {tmp_path} no se ha creado correctamente.")
        
        # Log para confirmar la creación
        current_app.logger.info(f"Archivo temporal creado en {tmp_path}")

        # Verificar que el archivo existe antes de copiarlo
        if not os.path.exists(tmp_path):
            current_app.logger.error(f"El archivo temporal no existe: {tmp_path}")
            return jsonify({'message': 'El archivo temporal no existe', 'success': False}), 500

        # Pausar un momento para asegurarse de que el archivo está disponible
        time.sleep(1)

        # Copiar el archivo al contenedor utilizando la ID del contenedor
        result = subprocess.run([
            'sudo', 'docker', 'cp', tmp_path, f"{container_id}:{file_path}"
        ], capture_output=True, text=True)
        
        if result.returncode != 0:
            current_app.logger.error("Error al copiar el archivo al contenedor: %s", result.stderr.strip())
            return jsonify({'message': 'Error al copiar al contenedor', 'success': False, 'error': result.stderr.strip()}), 500

        # Eliminar archivo temporal
        os.remove(tmp_path)

        return jsonify({'message': 'Archivo actualizado correctamente', 'success': True})

    except subprocess.CalledProcessError as e:
        current_app.logger.exception("Error al ejecutar subprocess")
        return jsonify({'message': f'Error al copiar al contenedor: {str(e)}', 'success': False}), 500

    except Exception as e:
        current_app.logger.exception("Error general")
        return jsonify({'message': f'Error procesando el archivo: {str(e)}', 'success': False}), 500
