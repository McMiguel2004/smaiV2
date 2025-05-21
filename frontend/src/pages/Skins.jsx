"use client"

import { useEffect, useRef, useState } from "react"
import { Box, Typography, Link, Fade, Button, Alert, CircularProgress, Tooltip, Snackbar } from "@mui/material"
import { Search as SearchIcon, Refresh as RefreshIcon, Download as DownloadIcon } from "@mui/icons-material"
import "../styles/Skins.css"

const Skins = () => {
  const scriptsLoaded = useRef(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [currentSkin, setCurrentSkin] = useState("")
  const [downloadNotification, setDownloadNotification] = useState(false)

  // Efecto para simular carga de página con animación
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Evitar cargar los scripts múltiples veces
    if (scriptsLoaded.current) return
    scriptsLoaded.current = true

    // Función para cargar scripts
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve()
          return
        }

        const script = document.createElement("script")
        script.src = src
        script.id = id
        script.async = true
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    // Cargar scripts en orden
    const loadAllScripts = async () => {
      try {
        await loadScript("/js/three.min.js", "three-js")
        await loadScript("/js/2dskin.js", "2dskin-js")
        await loadScript("/js/3dskin.js", "3dskin-js")

        // Configurar el evento de búsqueda por Enter
        const usernameInput = document.getElementById("username")
        if (usernameInput) {
          usernameInput.onkeypress = async (e) => {
            if (!e) e = window.event
            const keyCode = e.keyCode || e.which
            if (keyCode === 13) {
              e.preventDefault()
              await handleSearch(e)
            }
          }
        }

        // Configurar el evento de clic para descargar la imagen 2D
        setupCanvasDownload()
      } catch (error) {
        console.error("Error loading scripts:", error)
        setError("Error al cargar los visualizadores de skins. Por favor, recarga la página.")
      }
    }

    loadAllScripts()

    // Limpieza más agresiva al desmontar
    return () => {
      ;["canvas", "model"].forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          element.innerHTML = ""
        }
      })

      // Reiniciar Three.js si es necesario
      if (window.skinViewer) {
        window.skinViewer.dispose()
        delete window.skinViewer
      }
    }
  }, [])

  // Configurar la descarga del canvas al hacer clic
  const setupCanvasDownload = () => {
    const canvas = document.getElementById("canvas")
    if (canvas) {
      canvas.style.cursor = "pointer"
      canvas.title = "Haz clic para descargar la imagen"
      canvas.addEventListener("click", downloadCanvasImage)
    }
  }

  // Función para descargar la imagen del canvas
  const downloadCanvasImage = () => {
    const canvas = document.getElementById("canvas")
    if (!canvas) return

    // Crear un enlace temporal para la descarga
    const link = document.createElement("a")

    // Obtener la imagen del canvas
    const image = canvas.toDataURL("image/png")

    // Configurar el enlace de descarga
    link.href = image
    link.download = username ? `${username}_skin.png` : "minecraft_skin.png"

    // Simular clic en el enlace para iniciar la descarga
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Mostrar notificación
    setDownloadNotification(true)
  }

  // Función para obtener UUID del jugador
  const getUUID = async (playerName) => {
    try {
      setLoading(true)
      setError("")
      const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${playerName}`)
      const data = await response.json()

      if (data.error) {
        setError(`Error: ${data.error}`)
        return null
      }
      return data.uuid
    } catch (error) {
      setError("Error al conectar con la API de Mojang. Inténtalo de nuevo más tarde.")
      return null
    } finally {
      setLoading(false)
    }
  }

  // Función para buscar skin
  const handleSearch = async (e) => {
    e.preventDefault()
    const usernameInput = document.getElementById("username")
    const playerName = usernameInput.value.trim()

    if (!playerName) {
      setError("Por favor, introduce un nombre de usuario")
      return
    }

    setUsername(playerName)
    const uuid = await getUUID(playerName)
    if (uuid) {
      const skinUrl = `https://crafatar.com/skins/${uuid}`
      setCurrentSkin(skinUrl)
      if (window.img) {
        window.img.src = skinUrl
      }
    }
  }

  // Función para reiniciar el visor
  const handleReset = () => {
    if (window.skinViewer) {
      window.skinViewer.dispose()
      delete window.skinViewer
    }
    ;["canvas", "model"].forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        element.innerHTML = ""
      }
    })

    // Recargar los scripts
    const loadAllScripts = async () => {
      try {
        await loadScript("/js/2dskin.js", "2dskin-js-new")
        await loadScript("/js/3dskin.js", "3dskin-js-new")
        setupCanvasDownload()
      } catch (error) {
        console.error("Error reloading scripts:", error)
      }
    }

    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        const oldScript = document.getElementById(id)
        if (oldScript) {
          document.body.removeChild(oldScript)
        }

        const script = document.createElement("script")
        script.src = src
        script.id = id
        script.async = true
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    loadAllScripts()
    document.getElementById("username").value = ""
    setUsername("")
    setCurrentSkin("")
    setError("")
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: "64px", // Espacio para la navbar
      }}
    >
      <Fade in={pageLoaded}>
        <div className="skins-container">
          {error && (
            <Alert
              severity="error"
              sx={{
                position: "absolute",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                width: "80%",
                maxWidth: "500px",
                borderRadius: 0,
                border: "2px solid #5a5a5a",
              }}
            >
              {error}
            </Alert>
          )}

          <div id="sidebar">
            <div className="sidebar-header">
              <DownloadIcon className="sidebar-icon" />
              <h2>Visualizador de Skins</h2>
            </div>

            <div className="sidebar-section">
              <strong>Username</strong>
              <div className="search-container">
                <input id="username" type="text" placeholder="Nombre del jugador" />
                {loading ? (
                  <CircularProgress size={24} sx={{ ml: 1, color: "#4CAF50" }} />
                ) : (
                  <Button onClick={handleSearch} className="search-button" title="Buscar skin">
                    <SearchIcon />
                  </Button>
                )}
              </div>

              <div className="action-buttons">
                <Button onClick={handleReset} startIcon={<RefreshIcon />} className="reset-button">
                  Reiniciar
                </Button>

                {currentSkin && (
                  <Typography variant="body2" className="current-skin">
                    Skin: {username}
                  </Typography>
                )}
              </div>
            </div>

            <div className="sidebar-section">
              <strong>Toggle Visibility - Body Parts</strong>
              <div className="toggle-grid">
                <label>
                  <input id="headToggle" type="checkbox" defaultChecked />
                  Head
                </label>
                <label>
                  <input id="bodyToggle" type="checkbox" defaultChecked />
                  Body
                </label>
                <label>
                  <input id="leftArmToggle" type="checkbox" defaultChecked />
                  Left Arm
                </label>
                <label>
                  <input id="rightArmToggle" type="checkbox" defaultChecked />
                  Right Arm
                </label>
                <label>
                  <input id="leftLegToggle" type="checkbox" defaultChecked />
                  Left Leg
                </label>
                <label>
                  <input id="rightLegToggle" type="checkbox" defaultChecked />
                  Right Leg
                </label>
              </div>
            </div>

            <div className="sidebar-section">
              <strong>Toggle Visibility - Secondary Layer</strong>
              <div className="toggle-grid">
                <label>
                  <input id="head2Toggle" type="checkbox" defaultChecked />
                  Head
                </label>
                <label>
                  <input id="body2Toggle" type="checkbox" defaultChecked />
                  Body
                </label>
                <label>
                  <input id="leftArm2Toggle" type="checkbox" defaultChecked />
                  Left Arm
                </label>
                <label>
                  <input id="rightArm2Toggle" type="checkbox" defaultChecked />
                  Right Arm
                </label>
                <label>
                  <input id="leftLeg2Toggle" type="checkbox" defaultChecked />
                  Left Leg
                </label>
                <label>
                  <input id="rightLeg2Toggle" type="checkbox" defaultChecked />
                  Right Leg
                </label>
              </div>
            </div>
          </div>

          <div className="canvas-container">
            <Tooltip title="Haz clic para descargar" placement="top" arrow>
              <canvas id="canvas" width="192" height="192"></canvas>
            </Tooltip>
            <div className="canvas-label">Vista 2D (Clic para descargar)</div>
          </div>

          <div id="model"></div>
          <div className="model-label">Vista 3D</div>

          <div id="info">
            Skins downloaded from{" "}
            <Link href="https://crafatar.com/" target="_blank" rel="noopener noreferrer">
              Crafatar
            </Link>
          </div>

          <Snackbar
            open={downloadNotification}
            autoHideDuration={3000}
            onClose={() => setDownloadNotification(false)}
            message="Imagen descargada correctamente"
            ContentProps={{
              sx: {
                backgroundColor: "#4CAF50",
                color: "white",
                fontFamily: '"Minecraft-Seven", sans-serif',
                borderRadius: 0,
                border: "2px solid #2E7D32",
              },
            }}
          />
        </div>
      </Fade>
    </Box>
  )
}

export default Skins
