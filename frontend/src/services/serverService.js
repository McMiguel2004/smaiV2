const API_URL = "http://localhost:5000/api/servers"

export const serverService = {
  fetchServers: async () => {
    const res = await fetch(`${API_URL}/show_servers`, {
      method: "GET",
      credentials: "include",
    })
    if (!res.ok) throw new Error("No se pudo obtener la lista de servidores")
    return res.json()
  },

  createServer: async (data) => {
    const res = await fetch(`${API_URL}/Create_Server`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || "Error al crear servidor")
    }
    return res.json()
  },

  deleteServer: async (id) => {
    const res = await fetch(`${API_URL}/delete_server/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.message || "Error al borrar servidor")
    }
    return res.json()
  },

  startServer: async (id) => {
    const res = await fetch(`${API_URL}/Start_Server/${id}`, {
      method: "POST",
      credentials: "include",
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || "Error al iniciar servidor")
    return json
  },

  stopServer: async (id) => {
    const res = await fetch(`${API_URL}/stop_server/${id}`, {
      method: "POST",
      credentials: "include",
    })
    const text = await res.text()
    let json
    try {
      json = JSON.parse(text)
    } catch (e) {
      throw new Error("Respuesta inválida del servidor: " + text)
    }
    if (!res.ok) throw new Error(json.message || "Error al detener servidor")
    return json
  },

  restartServer: async (id) => {
    const res = await fetch(`${API_URL}/restart_server/${id}`, {
      method: "POST",
      credentials: "include",
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message || "Error al reiniciar")
    return data
  },

  uploadFile: async (serverId, file) => {
    const form = new FormData()
    form.append("archivo", file)
    form.append("servidorId", serverId)

    const res = await fetch(`${API_URL}/upfile`, {
      method: "POST",
      credentials: "include",
      body: form,
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    return data
  },

  // Nueva función para enviar comandos al servidor
  sendCommand: async (serverId, command) => {
    const res = await fetch(`${API_URL}/server_command/${serverId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ command }),
    })

    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Error al enviar comando")
    }

    return data
  },

  // ➕ Listar ficheros de un directorio dentro del contenedor
  listFiles: async (serverId, path = "/data") => {
    const res = await fetch(
      `${API_URL}/${serverId}/files?path=${encodeURIComponent(path)}`,
      { method: "GET", credentials: "include" }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error listando archivos");
    }
    return res.json(); // { success, path, files: [...] }
  },

  // ➕ Obtener el contenido de un fichero
  getFileContent: async (serverId, path) => {
    const res = await fetch(
      `${API_URL}/${serverId}/file-content?path=${encodeURIComponent(path)}`,
      { method: "GET", credentials: "include" }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error cargando contenido");
    }
    return res.json(); // { success, content: "..." }
  },

  updateFileContent: async (serverId, path, content) => {
    const res = await fetch(
      `${API_URL}/${serverId}/file-content`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ path, content }),
      }
    )
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.error || data.message || "Error al guardar fichero")
    }
    return data
  },

  importWorld: async (serverId, file) => {
    const form = new FormData();
    form.append("worldArchive", file);
    form.append("serverId", serverId);
    const res = await fetch(`${API_URL}/${serverId}/world/import`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Error importando World");
    return data;
  },

  exportWorld: async (serverId) => {
    const res = await fetch(`${API_URL}/${serverId}/world/export`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error exportando World");
    }
    return await res.blob();
  },

  deleteWorld: async (serverId) => {
    const res = await fetch(`${API_URL}/${serverId}/world`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Error eliminando World");
    return data;
  },

  getPlayers: async (serverId) => {
    const res = await fetch(`${API_URL}/${serverId}/players`, {
      method: "GET",
      credentials: "include",
    });
  
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Error al obtener jugadores");
    }
  
    return data; // { active: [...], banned: [...] }
  },
  
}
