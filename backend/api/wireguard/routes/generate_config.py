from flask import jsonify, current_app
from ..models import db, WireguardConfig
from ..utils import generate_wireguard_keys, get_next_available_ip, create_client_config, remove_user_peers, update_server_config
from ...auth.utils import token_required
import os

# Server configuration constants
SERVER_PUBLIC_KEY = "jwmkYl51tCQ6e5iyhfor5rYb5bnak8QQZemV7ka8QiI="  # Your server's public key
SERVER_ENDPOINT = "smai.duckdns.org:51821"  # Your server's public endpoint

@token_required
def generate_config(current_user):
    """
    Generate or regenerate WireGuard configuration for the authenticated user.
    Ensures only one configuration exists per user.
    """
    try:
        # Delete ALL existing configurations for this user
        WireguardConfig.query.filter_by(user_id=current_user.id).delete()
        
        # Generate new WireGuard keys
        private_key, public_key = generate_wireguard_keys()
        if not private_key or not public_key:
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Failed to generate WireGuard keys'
            }), 500
        
        # Get next available IP
        client_ip = get_next_available_ip(current_user.id)
        if not client_ip:
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'No available IP addresses'
            }), 500

        # --- Movemos la validación aquí, después de obtener client_ip ---
        # Verificar si la IP ya está en uso EN EL SERVIDOR (no solo en DB)
        existing_peer = WireguardConfig.query.filter_by(
            wireguard_ip=client_ip
        ).first()
        
        if existing_peer:
            # Forzar liberación de IP duplicada
            remove_user_peers(existing_peer.user_id)
            db.session.delete(existing_peer)
            db.session.commit()
        
        # Resto del código original...
        # Create client configuration
        client_config = create_client_config(
            private_key=private_key,
            client_ip=client_ip,
            server_public_key=SERVER_PUBLIC_KEY,
            server_endpoint=SERVER_ENDPOINT
        )
        
        # Create new config
        new_config = WireguardConfig(
            user_id=current_user.id,
            wireguard_conf=client_config,
            wireguard_public_key=public_key,
            wireguard_private_key=private_key,
            wireguard_ip=client_ip
        )
        
        db.session.add(new_config)
        db.session.commit()
        
        # Update server configuration
        try:
            # First remove any existing peers for this user
            remove_user_peers(current_user.id)
            # Then add new peer
            update_server_config(public_key, client_ip)
        except Exception as e:
            current_app.logger.warning(f"Could not update server config: {e}")
            # Continue even if server update fails
        
        return jsonify({
            'success': True,
            'message': 'WireGuard configuration generated successfully',
            'config': client_config,
            'ip': client_ip
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Error generating WireGuard configuration")
        return jsonify({
            'success': False,
            'message': f'Internal server error: {str(e)}'
        }), 500
