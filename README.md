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

project-root/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── (otros archivos de configuración)
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   └── (otros archivos del frontend)
├── README.md
└── (otros archivos o carpetas que creas necesarios)
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
