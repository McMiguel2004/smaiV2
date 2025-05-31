# 🎮 SMAI V2 - Servidores de Minecraft Automatizados Increíbles

**Plataforma web moderna para crear y gestionar servidores de Minecraft con Docker**

Una solución completa que permite a los usuarios crear, configurar y administrar servidores de Minecraft de forma sencilla a través de una interfaz web intuitiva.
## 🏷️ Tecnologías y Herramientas

### 🚀 **Stack Principal**
![SMAI V2](https://img.shields.io/badge/SMAI-V2-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)

### 💻 **Lenguajes de Programación**
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Shell Script](https://img.shields.io/badge/shell_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white)
![YAML](https://img.shields.io/badge/yaml-%23ffffff.svg?style=for-the-badge&logo=yaml&logoColor=151515)

### 🛠️ **Herramientas de Desarrollo**
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)

### ⚙️ **DevOps e Infraestructura**
![Ansible](https://img.shields.io/badge/ansible-%231A1918.svg?style=for-the-badge&logo=ansible&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
![Wireguard](https://img.shields.io/badge/wireguard-%2388171A.svg?style=for-the-badge&logo=wireguard&logoColor=white)

### 🌐 **Servicios y Comunicación**
![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)
![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)
![Google Drive](https://img.shields.io/badge/Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)

## 🚀 Características Principales

### 🎯 **Gestión de Servidores**
- ✅ **Creación automática** de servidores de Minecraft
- ✅ **Configuración personalizable** (dificultad, modo de juego, jugadores máximos)
- ✅ **Soporte para múltiples versiones** de Minecraft
- ✅ **Integración con CurseForge** para modpacks
- ✅ **Gestión de puertos** automática

### 🔧 **Tecnologías Utilizadas**
- **Backend:** Python + Flask + PostgreSQL
- **Frontend:** React + Vite + CSS moderno
- **Contenedores:** Docker + itzg/minecraft-server
- **Base de datos:** PostgreSQL con esquemas optimizados

### 🛡️ **Seguridad y Redes**
- ✅ **Autenticación JWT** para usuarios
- ✅ **Aislamiento de contenedores** Docker
- ✅ **Gestión de tokens** seguros

## 📋 Requisitos del Sistema

### Mínimos
- **OS:** Ubuntu 22.04
- **RAM:** 4GB (8GB recomendado)
- **CPU:** 2 cores (4 cores recomendado)
- **Almacenamiento:** 20GB libres
- **Red:** Conexión a internet estable

### Dependencias
- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- Docker 20.10+

## 🚀 Instalación

### Opción 1: Instalación Automática (Recomendada)
Usa nuestros scripts de automatización con Ansible:

```bash
git clone https://github.com/hammad2003/Scripts-Playbooks-V2.git
cd Scripts-Playbooks-V2
chmod +x run.sh
./run.sh
```

### Opción 2: Instalación Manual

#### 1. Clonar el repositorio
```bash
git clone https://github.com/McMiguel2004/smaiV2.git
cd smaiV2
```

#### 2. Configurar la base de datos
```sql
-- Conectar a PostgreSQL como superusuario
sudo -u postgres psql

-- Crear base de datos y usuario
CREATE DATABASE smai;
CREATE USER usuario WITH PASSWORD 'usuario';
GRANT ALL PRIVILEGES ON DATABASE smai TO usuario;

-- Crear tipos ENUM
\\c smai
CREATE TYPE difficulty_enum AS ENUM ('hard', 'normal', 'easy', 'peaceful');
CREATE TYPE mode_enum AS ENUM ('creative', 'survival', 'adventure', 'spectator');
```

#### 3. Configurar el Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### 4. Configurar el Frontend
```bash
cd frontend
npm install
npm run dev -- --host
```

## 🗄️ Esquema de Base de Datos

### Tablas Principales

#### **users** - Gestión de usuarios
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR(50) UNIQUE)
- email (VARCHAR(100) UNIQUE)
- password (VARCHAR(255))
- token (TEXT)
- jwt (TEXT)
- created_at (TIMESTAMP)
- servers_created (INT)
```

#### **servers** - Servidores de Minecraft
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(255))
- software (VARCHAR(50))
- version (VARCHAR(20))
- curseforge_modpack_url (VARCHAR(500))
- user_id (INT REFERENCES users)
- container_id (VARCHAR(255))
- status (VARCHAR(20))
- ip_address (VARCHAR(255))
- port (INTEGER)
- created_at (TIMESTAMP)
```

#### **server_properties** - Configuración de servidores
```sql
- id (SERIAL PRIMARY KEY)
- server_id (INT REFERENCES servers)
- difficulty (difficulty_enum)
- mode (mode_enum)
- max_players (INT)
- max_build_height (INT)
- view_distance (INT)
- spawn_npcs (BOOLEAN)
- allow_nether (BOOLEAN)
- spawn_animals (BOOLEAN)
- spawn_monsters (BOOLEAN)
- pvp (BOOLEAN)
- enable_command_block (BOOLEAN)
- allow_flight (BOOLEAN)
```

#### **wireguard_configs** - Configuraciones de red
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INT REFERENCES users)
- wireguard_conf (TEXT)
- wireguard_public_key (VARCHAR(255))
- wireguard_private_key (VARCHAR(255))
- wireguard_ip (VARCHAR(15))
- created_at (TIMESTAMP)
```

## 🎮 Uso de la Plataforma

### Acceso a la Aplicación
- **Frontend:** \`http://localhost:5173\`
- **Backend API:** \`http://localhost:5000\`

### Flujo de Trabajo

1. **📝 Registro/Login** - Crear cuenta o iniciar sesión
2. **🎮 Crear Servidor** - Configurar nuevo servidor de Minecraft
3. **⚙️ Personalizar** - Ajustar dificultad, modo, jugadores, etc.
4. **🚀 Desplegar** - El sistema crea automáticamente el contenedor Docker
5. **🔗 Conectar** - Usar la IP y puerto generados para conectar
6. **📊 Gestionar** - Monitorear y administrar el servidor

### Características del Frontend

#### 🎨 **Interfaz Moderna**
- Diseño responsive y intuitivo
- Componentes React reutilizables
- Navegación fluida con React Router

#### 📊 **Dashboard de Gestión**
- Lista de servidores del usuario
- Logs de actividad

#### ⚙️ **Configuración Avanzada**
- Editor de propiedades del servidor
- Gestión de mods

## 🔧 API del Backend

### Endpoints Principales

#### Autenticación
```
POST /api/auth/register    # Registro de usuario
POST /api/auth/login       # Inicio de sesión
POST /api/auth/logout      # Cerrar sesión
```

#### Servidores
```
GET    /api/servers        # Listar servidores del usuario
POST   /api/servers        # Crear nuevo servidor
GET    /api/servers/:id    # Obtener servidor específico
PUT    /api/servers/:id    # Actualizar servidor
DELETE /api/servers/:id    # Eliminar servidor
```

#### Gestión
```
POST /api/servers/:id/start    # Iniciar servidor
POST /api/servers/:id/stop     # Detener servidor
POST /api/servers/:id/restart  # Reiniciar servidor
GET  /api/servers/:id/logs     # Obtener logs del servidor
```

## 🐳 Integración con Docker

### Imagen Base
Utiliza la imagen oficial \`itzg/minecraft-server\` que soporta:

- ✅ **Múltiples versiones** de Minecraft
- ✅ **Forge, Fabric**
- ✅ **Modpacks de CurseForge**
- ✅ **Configuración automática**

### Configuración de Contenedores
```yaml
# Ejemplo de configuración Docker
environment:
  EULA: "TRUE"
  TYPE: "FORGE"
  VERSION: "1.20.1"
  MEMORY: "2G"
  DIFFICULTY: "normal"
  MODE: "survival"
  MAX_PLAYERS: "20"
```

## 🔒 Seguridad

### Medidas Implementadas
- **🔐 Autenticación JWT** con tokens seguros
- **🛡️ Validación de entrada** en todas las APIs
- **🔒 Aislamiento de contenedores** Docker
- **🌐 Configuración WireGuard** para conexiones seguras
- **📝 Logs de auditoría** para todas las acciones

### Configuración de Red
- **Puertos dinámicos** para evitar conflictos
- **Firewall automático** con iptables
- **VPN WireGuard** para acceso remoto seguro
- **Proxy reverso** opcional con nginx

## 🚀 Desarrollo

### Estructura del Proyecto
```
smaiV2/
├── backend/                 # API Flask + PostgreSQL
│   ├── app.py              # Aplicación principal
│   ├── models/             # Modelos de base de datos
│   ├── routes/             # Endpoints de la API
│   ├── utils/              # Utilidades y helpers
│   └── requirements.txt    # Dependencias Python
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilidades frontend
│   │   └── styles/         # Estilos CSS
│   ├── package.json        # Dependencias Node.js
│   └── vite.config.js      # Configuración Vite
└── README.md               # Este archivo
```

### Comandos de Desarrollo

#### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py                    # Modo desarrollo
```

#### Frontend
```bash
cd frontend
npm install
npm run dev                      # Servidor de desarrollo
npm run build                    # Build de producción
npm run preview                  # Preview del build
```

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. **Commit** tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. **Push** a la rama (\`git push origin feature/AmazingFeature\`)
5. **Abre** un Pull Request

### Guías de Contribución
- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación cuando sea necesario
- Usa commits descriptivos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo \`LICENSE\` para más detalles.

## 🙏 Agradecimientos
- **[hammad2003](https://github.com/hammad2003)** por los scripts de automatización [Scripts-Playbooks-V2](https://github.com/hammad2003/Scripts-Playbooks-V2)
- **Comunidad de Minecraft** por la inspiración
- **itzg** por la excelente imagen Docker de Minecraft
- **Comunidad Open Source** por las herramientas utilizadas

## 📞 Soporte y Contacto

- **🐛 Issues:** [GitHub Issues](https://github.com/McMiguel2004/smaiV2/issues)
- **💬 Discusiones:** [GitHub Discussions](https://github.com/McMiguel2004/smaiV2/discussions)
- **📧 Email:** [tu-email@ejemplo.com]

## 🗺️ Roadmap

### Próximas Características
- [ ] **Panel de administración** avanzado
- [ ] **Métricas en tiempo real** con gráficos
- [ ] **Sistema de plugins** personalizado
- [ ] **Backup automático** programado
- [ ] **Integración con Discord** para notificaciones
- [ ] **Soporte para Bedrock Edition**
- [ ] **Marketplace de modpacks** integrado

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub**

```bash
# Verificación rápida de funcionamiento
curl -s http://localhost:5000
curl -s http://localhost:5173
```

**🎮 ¡Disfruta creando y gestionando tus servidores de Minecraft!**
