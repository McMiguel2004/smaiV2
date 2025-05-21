import re
import requests
from flask import request, jsonify, current_app
from ..models import db, Server, ServerProperties, DifficultyEnum, ModeEnum

def extract_modpack_info(url):
    """Extract modpack information from CurseForge URL."""
    try:
        # Basic validation for CurseForge URL
        if not url or not re.match(r'^https?://www\.curseforge\.com/minecraft/modpacks/[^/]+(/download/\d+|\/files/\d+)?/?$', url):
            return None, None
        
        # Extract modpack name from URL
        modpack_name = url.split('/modpacks/')[1].split('/')[0]
        
        # Try to determine Minecraft version from URL or default to latest
        # In a real implementation, you might want to scrape the actual version from the page
        version = "1.20.1"  # Default to a common version
        
        return modpack_name, version
    except Exception as e:
        current_app.logger.exception(f"Error extracting modpack info: {e}")
        return None, None

def create_server():
    """
    Creates a new server and its properties.
    Only allows up to 4 servers per user.
    """
    try:
        data = request.get_json()
        current_app.logger.debug("Data received in create_server: %s", data)
        
        # Validate required fields
        required_fields = ['nombreServidor', 'software']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({'success': False, 'message': f"Missing field(s): {', '.join(missing)}"}), 400

        # Get authenticated user ID
        me = requests.get(f"{request.host_url}api/auth/me", cookies=request.cookies)
        if me.status_code != 200:
            return jsonify({'success': False, 'message': "Could not get user information"}), 400
        uid = me.json().get('id')

        # Check server limit
        count = Server.query.filter_by(user_id=uid).count()
        if count >= 4:
            return jsonify({'success': False, 'message': 'Maximum number of servers reached'}), 403

        # Handle modpack URL if provided
        version = data.get('version', '1.20.1')
        curseforge_url = data.get('modpack')
        
        if curseforge_url and data.get('software') == 'Modpack':
            modpack_name, modpack_version = extract_modpack_info(curseforge_url)
            if not modpack_name:
                return jsonify({'success': False, 'message': 'Invalid CurseForge modpack URL'}), 400
            
            # Use modpack version if available
            if modpack_version:
                version = modpack_version

        # Create server
        srv = Server(
            name=data['nombreServidor'], 
            software=data['software'], 
            version=version, 
            user_id=uid,
            curseforge_modpack_url=curseforge_url if data.get('software') == 'Modpack' else None
        )
        db.session.add(srv)
        db.session.flush()

        # Create server properties
        diff = DifficultyEnum(data.get('difficulty', 'normal').lower()).value
        mode = ModeEnum(data.get('mode', 'survival').lower()).value
        props = ServerProperties(
            server_id=srv.id,
            difficulty=diff,
            mode=mode,
            max_players=data.get('maxPlayers', 20),
            max_build_height=data.get('maxBuildHeight', 256),
            view_distance=data.get('viewDistance', 10),
            spawn_npcs=data.get('spawnNpcs', True),
            allow_nether=data.get('allowNether', True),
            spawn_animals=data.get('spawnAnimals', True),
            spawn_monsters=data.get('spawnMonsters', True),
            pvp=data.get('pvp', True),
            enable_command_block=data.get('enableCommandBlock', False),
            allow_flight=data.get('allowFlight', False)
        )
        db.session.add(props)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Server created successfully'}), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Error creating server")
        return jsonify({'success': False, 'message': str(e)}), 500
