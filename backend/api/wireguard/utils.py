import os
import subprocess
import ipaddress
from flask import current_app
import secrets
import string
import fcntl

def generate_wireguard_keys():
    """Generate a new WireGuard private and public key pair."""
    try:
        # Generate private key
        private_key = subprocess.check_output(["wg", "genkey"], text=True).strip()
        
        # Generate public key from private key
        public_key = subprocess.check_output(["wg", "pubkey"], input=private_key, text=True).strip()
        
        return private_key, public_key
    except Exception as e:
        current_app.logger.error(f"Error generating WireGuard keys: {e}")
        return None, None

def get_next_available_ip(user_id):
    """
    Get IP address for user, reusing existing one if available
    """
    try:
        from ..wireguard.models import WireguardConfig
        base_network = "192.168.9.0/24"
        network = ipaddress.IPv4Network(base_network)
        
        # First check if user already has a config
        existing_config = WireguardConfig.query.filter_by(user_id=user_id).first()
        if existing_config:
            return existing_config.wireguard_ip
        
        # Get all used IPs from database
        used_ips = [config.wireguard_ip for config in WireguardConfig.query.all()]
        
        # Also check currently configured peers in wg0.conf
        wg_config_path = "/etc/wireguard/wg0.conf"
        # Mejorar parsing de AllowedIPs
        if os.path.exists(wg_config_path):
            with open(wg_config_path, 'r') as f:
                for line in f:
                    if line.strip().startswith('AllowedIPs'):
                        ips = line.split('=')[1].strip().split(',')
                        for ip in ips:
                            clean_ip = ip.strip().split('/')[0]
                            if clean_ip not in used_ips:
                                used_ips.append(clean_ip)
        
        # Start from .2 (as .1 is the server)
        for i in range(2, network.num_addresses):
            ip = str(network[i])
            if ip not in used_ips:
                return ip
                
        current_app.logger.error(f"No available IPs in the {base_network} range")
        return None
    except Exception as e:
        current_app.logger.error(f"Error getting next available IP: {e}")
        return None

def create_client_config(private_key, client_ip, server_public_key, server_endpoint):
    """
    Create a WireGuard client configuration file content.
    """
    config = f"""[Interface]
# Client private key
PrivateKey = {private_key}

# Client IP address
Address = {client_ip}/24

[Peer]
# Server public key
PublicKey = {server_public_key}

# Allow traffic to the entire VPN subnet
AllowedIPs = 192.168.9.0/24

# Server endpoint (public IP or domain and port)
Endpoint = {server_endpoint}

# Keep connection alive
PersistentKeepalive = 25
"""
    return config

def update_server_config(public_key, client_ip):
    """
    Add a new peer to server config, ensuring no duplicates
    """
    try:
        wg_config_path = "/etc/wireguard/wg0.conf"
        
        # First check if this peer already exists
        with open(wg_config_path, 'r') as f:
            config_content = f.read()
        
        # If peer already exists, remove it first
        if f"PublicKey = {public_key}" in config_content:
            remove_peer_from_server(public_key)
        
        # Add new peer
        new_peer = f"""
[Peer]
# Client public key
PublicKey = {public_key}

# Client's allowed IP
AllowedIPs = {client_ip}/32
"""
        with open(wg_config_path, "a") as f:
            f.write(new_peer)
        
        # Apply changes
        subprocess.run(["wg", "syncconf", "wg0", wg_config_path], check=True)
        
        return True
    except Exception as e:
        current_app.logger.error(f"Error updating server config: {e}")
        return False

def generate_config_name():
    """Generate a random name for the config file."""
    random_suffix = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(6))
    return f"smai_vpn_{random_suffix}.conf"

def update_server_config(public_key, client_ip):
    try:
        wg_config_path = "/etc/wireguard/wg0.conf"
        
        # Bloquear archivo durante la operación
        with open(wg_config_path, 'r+') as f:
            fcntl.flock(f, fcntl.LOCK_EX)
            
            # Leer y procesar contenido
            lines = f.readlines()
            f.seek(0)
            
            # Lógica para remover peer existente
            # ... (usar la nueva lógica de remove_peer_from_server)
            
            # Añadir nuevo peer
            new_peer = f"\n[Peer]\nPublicKey = {public_key}\nAllowedIPs = {client_ip}/32\n"
            f.writelines(lines + [new_peer])
            f.truncate()
            
            fcntl.flock(f, fcntl.LOCK_UN)
        
        subprocess.run(["wg", "syncconf", "wg0", wg_config_path], check=True)
        return True
    except Exception as e:
        current_app.logger.error(f"Error atómico: {str(e)}")
        return False

def remove_user_peers(user_id):
    """
    Remove all peers from server config that belong to a specific user
    """
    try:
        from ..wireguard.models import WireguardConfig
        # Get all public keys for this user
        user_configs = WireguardConfig.query.filter_by(user_id=user_id).all()
        
        for config in user_configs:
            remove_peer_from_server(config.wireguard_public_key)
            
        return True
    except Exception as e:
        current_app.logger.error(f"Error removing user peers: {e}")
        return False


def remove_peer_from_server(public_key):
    """
    Remove a specific peer from server config by public key (fixed version)
    """
    try:
        wg_config_path = "/etc/wireguard/wg0.conf"
        
        with open(wg_config_path, 'r') as f:
            lines = f.readlines()
        
        new_lines = []
        current_peer_block = []
        in_target_peer = False
        
        for line in lines:
            if line.strip().startswith('[Peer]'):
                # Procesar bloque anterior
                if current_peer_block:
                    if not in_target_peer:
                        new_lines.extend(current_peer_block)
                    current_peer_block = []
                    in_target_peer = False
                
                current_peer_block.append(line)
                continue
                
            if current_peer_block:
                current_peer_block.append(line)
                if line.strip().startswith('PublicKey'):
                    current_pubkey = line.split('=')[1].strip()
                    if current_pubkey == public_key:
                        in_target_peer = True
            else:
                new_lines.append(line)
        
        # Añadir último bloque si no era el target
        if current_peer_block and not in_target_peer:
            new_lines.extend(current_peer_block)
        
        # Escribir nuevo archivo
        with open(wg_config_path, 'w') as f:
            f.writelines(new_lines)
        
        subprocess.run(["wg", "syncconf", "wg0", wg_config_path], check=True)
        return True
    except Exception as e:
        current_app.logger.error(f"Error removing peer: {str(e)}")
        return False
