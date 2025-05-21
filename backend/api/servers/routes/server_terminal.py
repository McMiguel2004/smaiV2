import subprocess
import time
from flask import Response, jsonify, stream_with_context, current_app
from ..utils import get_authenticated_user_id
from ..models import Server

def server_terminal(server_id):
    """
    Streams real-time new lines from the server's latest.log file.
    """
    # 1. Verify authentication
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({'success': False, 'message': 'User not authenticated'}), 401

    # 2. Verify if the server exists and belongs to the user
    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify({'success': False, 'message': 'Server not found'}), 404

    # 3. Verify that the server has a Docker container assigned
    if not server.container_id:
        return jsonify({'success': False, 'message': 'Container not associated with server'}), 400

    # 4. SSE event generator function
    def generate():
        cmd = [
            'sudo', 'docker', 'exec', server.container_id,
            'tail', '-n', '50', '-f', '/data/logs/latest.log'
        ]
        proc = None
        try:
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            
            # Send initial message to confirm connection
            yield f"data: Conectado a la consola del servidor #{server_id}...\n\n"
            
            for line in iter(proc.stdout.readline, ''):
                # Format the log line for better readability
                formatted_line = line.rstrip()
                if formatted_line:
                    yield f"data: {formatted_line}\n\n"
                    time.sleep(0.05)  # Small delay to prevent flooding
        except Exception as e:
            current_app.logger.exception("Error reading logs with tail -f")
            yield f"data: ERROR: {str(e)}\n\n"
        finally:
            if proc:
                proc.terminate()

    # 5. Server-Sent Events response with CORS headers
    response = Response(stream_with_context(generate()), mimetype='text/event-stream')
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Cache-Control', 'no-cache')
    response.headers.add('Connection', 'keep-alive')
    return response
