# Servidores de Minecraft. Automatizados. Increíbles.

Este proyecto incluye un backend en Python y un frontend en JavaScript.  
La instalación del entorno se realiza de forma automática utilizando **Ansible**, el cual se encuentra en un repositorio aparte.

---

## 🛠️ Instalación automática con Ansible

Para instalar todos los paquetes necesarios (Python, Node.js, dependencias, etc.), debes clonar y ejecutar el Ansible desde este repositorio:

🔗 [Repositorio Ansible (poner enlace aquí)](https://github.com/hammad2003/Scripts-Playbooks-V2)

```bash
git clone https://github.com/hammad2003/Scripts-Playbooks-V2.git
cd Scripts-Playbooks-V2
./run.sh
```

---

## 🚀 Cómo ejecutar el proyecto

Una vez finalizada la instalación con Ansible, simplemente entra en las carpetas correspondientes y ejecuta los comandos para levantar cada parte del proyecto.

### Backend (Python)

```bash
cd backend
python3 app.py
```
---

### Frontend (Node.js)

```bash
cd frontend
npm install
npm run dev
```

---

### 🧱 Estructura del proyecto

```bash
.
├── backend
│   ├── api
│   │   ├── auth
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── routes
│   │   │   │   ├── __init__.py
│   │   │   │   ├── login.py
│   │   │   │   ├── logout.py
│   │   │   │   ├── me.py
│   │   │   │   ├── refresh.py
│   │   │   │   └── register.py
│   │   │   └── utils.py
│   │   ├── servers
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── routes
│   │   │   │   ├── create_server.py
│   │   │   │   ├── delete_server.py
│   │   │   │   ├── __init__.py
│   │   │   │   ├── list_archive.py
│   │   │   │   ├── players.py
│   │   │   │   ├── restart_server.py
│   │   │   │   ├── server_command.py
│   │   │   │   ├── server_startup_status.py
│   │   │   │   ├── server_status.py
│   │   │   │   ├── server_terminal.py
│   │   │   │   ├── show_servers.py
│   │   │   │   ├── start_server.py
│   │   │   │   ├── stop_server.py
│   │   │   │   ├── upload_file.py
│   │   │   │   └── worldmanage.py
│   │   │   └── utils.py
│   │   └── wireguard
│   │       ├── __init__.py
│   │       ├── models.py
│   │       ├── routes
│   │       │   ├── download_config.py
│   │       │   └── generate_config.py
│   │       └── utils.py
│   ├── app.py
│   ├── config.py
│   └── requirements.txt
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── assets
│   │   │   ├── fonts
│   │   │   │   ├── Minecraft-Seven_v2.woff2
│   │   │   │   ├── MinecraftTen.woff
│   │   │   │   └── NotoSans-Regular.woff2
│   │   │   └── images
│   │   └── js
│   │       ├── 2dskin.js
│   │       ├── 3dskin.js
│   │       └── three.min.js
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── Home
│   │   │   │   ├── AdditionalContent.jsx
│   │   │   │   ├── FeaturesSection.jsx
│   │   │   │   ├── HeroParallax.jsx
│   │   │   │   ├── ServerTable.jsx
│   │   │   │   └── StatsCounter.jsx
│   │   │   ├── Navbar
│   │   │   │   ├── AccountIcon.jsx
│   │   │   │   ├── AccountMenu.jsx
│   │   │   │   ├── CenterButtons.jsx
│   │   │   │   ├── Logo.jsx
│   │   │   │   ├── MobileMenu.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── NavButton.jsx
│   │   │   ├── servers
│   │   │   │   ├── admin
│   │   │   │   │   ├── DockerView.jsx
│   │   │   │   │   ├── Players.jsx
│   │   │   │   │   ├── ServerSettings.jsx
│   │   │   │   │   └── WorldManage.jsx
│   │   │   │   ├── CommandSuggestions.jsx
│   │   │   │   ├── ServerActions.jsx
│   │   │   │   ├── ServerCard.jsx
│   │   │   │   ├── ServerFilter.jsx
│   │   │   │   ├── ServerForm.jsx
│   │   │   │   ├── ServerLogModal.jsx
│   │   │   │   ├── ServerStartupMonitor.jsx
│   │   │   │   ├── ServerStatus.jsx
│   │   │   │   └── ServerUploadModal.jsx
│   │   │   ├── Sesion
│   │   │   │   ├── SubmitButton.jsx
│   │   │   │   └── TextInput.jsx
│   │   │   └── wireguard
│   │   │       └── WireguardConfigGenerator.jsx
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks
│   │   │   ├── useServerForm.js
│   │   │   ├── useServerLogs.js
│   │   │   └── useServers.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Logout.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Server_admin.jsx
│   │   │   ├── Servers.jsx
│   │   │   ├── Skins.jsx
│   │   │   └── Wireguard.jsx
│   │   ├── protected
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services
│   │   │   └── serverService.js
│   │   ├── styles
│   │   │   ├── Home.css
│   │   │   ├── Login.css
│   │   │   ├── Logout.css
│   │   │   ├── Navbar.css
│   │   │   ├── Register.css
│   │   │   ├── Servers.css
│   │   │   ├── Skins.css
│   │   │   └── Wireguard.css
│   │   └── theme.js
│   └── vite.config.js
└── README.md
```

---

### 📦 Dependencias recomendadas

###### Backend:

Flask o FastAPI (según tu app.py).
Otras librerías listadas en backend/requirements.txt.

###### Frontend:

Vite, React o Vue (dependiendo de tu configuración).
Cualquier librería adicional que aparezca en frontend/package.json.

---


### ✨ Notas finales
Si encuentras errores durante la ejecución, revisa que todas las dependencias estén correctamente instaladas.

Verifica las versiones de Python y Node.js recomendadas por el proyecto.

Para actualizar los paquetes del frontend, puedes usar:

```bash
cd frontend
npm update
```
