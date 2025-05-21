import os
import subprocess
from datetime import datetime
from flask import jsonify, current_app
from ..utils import get_authenticated_user_id
from ..models import db, Server

def start_server(server_id):
    """
    Starts (or creates and then starts) a Docker container for the specified server,
    including the -e TYPE based on the software chosen by the user.
    """
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({'success': False, 'message': "User not authenticated"}), 401

    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify({'success': False, 'message': 'Server not found or not authorized'}), 404

    props = server.properties
    puerto = 25565 + server_id

    # Software -> TYPE mapping
    type_map = {
        'java':    None,
        'forge':  'FORGE',
        'fabric': 'FABRIC',
        'spigot': 'SPIGOT',
        'bukkit': 'BUKKIT',
        'modpack': None,
    }
    sof = server.software.strip().lower()
    type_env = type_map.get(sof, None)

    # Build base command
    cmd = [
        "sudo", "docker", "run", "-d", "-it",
        "-p", f"{puerto}:25565",
        "-e", "EULA=TRUE",
        "-e", "ONLINE_MODE=FALSE",
        "-e", "ENABLE_AUTOSTOP=TRUE",
        "-e", "ENABLE_RCON=TRUE",
        "-e", "ICON=https://github.com/hammad2003/smai/blob/master/Img/MacacoSmai.png?raw=true",
    ]

    # Handle modpack if URL is provided
    if server.curseforge_modpack_url and sof == 'modpack':
         # Add env file for CurseForge API credentials
        env_file_path = "/home/usuario/smaiV2/backend/.env"
        if os.path.exists(env_file_path):
            cmd.extend(["--env-file", env_file_path])
        
        # Use AUTO_CURSEFORGE type and CF_PAGE_URL for modpacks
        cmd.extend([
            "-e", f"CF_PAGE_URL={server.curseforge_modpack_url}",
            "-e", "TYPE=AUTO_CURSEFORGE"
        ])
    else:
        cmd.append("-e")
        cmd.append(f"VERSION={server.version}")
        
        # Add TYPE if applicable
        if type_env:
            cmd.extend(["-e", f"TYPE={type_env}"])

    # Advanced properties only if they differ from default
    if props.max_players      != 20:       cmd += ["-e", f"MAX_PLAYERS={props.max_players}"]
    if props.difficulty.value != 'easy':   cmd += ["-e", f"DIFFICULTY={props.difficulty.value}"]
    if props.mode.value       != 'survival':cmd += ["-e", f"MODE={props.mode.value}"]
    if props.max_build_height != 256:      cmd += ["-e", f"MAX_BUILD_HEIGHT={props.max_build_height}"]
    if props.view_distance    != 10:       cmd += ["-e", f"VIEW_DISTANCE={props.view_distance}"]
    if not props.spawn_npcs:               cmd += ["-e", f"SPAWN_NPCS={str(props.spawn_npcs).lower()}"]
    if not props.allow_nether:             cmd += ["-e", f"ALLOW_NETHER={str(props.allow_nether).lower()}"]
    if not props.spawn_animals:            cmd += ["-e", f"SPAWN_ANIMALS={str(props.spawn_animals).lower()}"]
    if not props.spawn_monsters:           cmd += ["-e", f"SPAWN_MONSTERS={str(props.spawn_monsters).lower()}"]
    if not props.pvp:                      cmd += ["-e", f"PVP={str(props.pvp).lower()}"]
    if props.enable_command_block:         cmd += ["-e", f"ENABLE_COMMAND_BLOCK={str(props.enable_command_block).lower()}"]
    if props.allow_flight:                 cmd += ["-e", f"ALLOW_FLIGHT={str(props.allow_flight).lower()}"]

    # Finally add the image
    cmd.append("itzg/minecraft-server")

    try:
        if not server.container_id:
            # Create container
            container_id = subprocess.check_output(cmd, text=True).strip()
            server.container_id = container_id
            server.ip_address   = subprocess.check_output(["hostname", "-I"], text=True).strip().split()[0]
            server.port         = puerto
            server.status       = 'Activo'
            server.created_at   = datetime.utcnow()
        else:
            # Just start
            subprocess.check_output(["sudo", "docker", "start", server.container_id], text=True)
            server.status = 'Activo'

        db.session.commit()
        current_app.logger.info("Server %s started by user %s", server_id, user_id)
        return jsonify({'success': True, 'message': 'Server started successfully'}), 200

    except subprocess.CalledProcessError as e:
        current_app.logger.error("Error starting Docker container: %s", e)
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error starting Docker server'}), 500
