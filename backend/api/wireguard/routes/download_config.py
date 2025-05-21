from flask import jsonify, send_file, current_app, make_response
from ..models import WireguardConfig
from ...auth.utils import token_required
from ..utils import generate_config_name
import os
import tempfile

@token_required
def download_config(current_user):
    """
    Download the WireGuard configuration file for the authenticated user.
    """
    try:
        # Get user's WireGuard configuration
        config = WireguardConfig.query.filter_by(user_id=current_user.id).first()
        
        if not config:
            return jsonify({
                'success': False,
                'message': 'No WireGuard configuration found for this user'
            }), 404
        
        # Create a temporary file with the configuration
        fd, path = tempfile.mkstemp(suffix='.conf')
        try:
            with os.fdopen(fd, 'w') as tmp:
                tmp.write(config.wireguard_conf)
            
            # Generate a filename for the download
            filename = generate_config_name()
            
            # Send the file as an attachment
            response = make_response(send_file(
                path,
                as_attachment=True,
                download_name=filename,
                mimetype='text/plain'
            ))
            
            return response
            
        finally:
            # Clean up the temporary file
            os.remove(path)
            
    except Exception as e:
        current_app.logger.exception("Error downloading WireGuard configuration")
        return jsonify({
            'success': False,
            'message': f'Internal server error: {str(e)}'
        }), 500
