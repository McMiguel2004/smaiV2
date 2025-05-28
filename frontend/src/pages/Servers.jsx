"use client"

import { useState, useEffect, useContext } from "react"
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Container,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Add, Refresh, Storage } from "@mui/icons-material"
import { useServers } from "../hooks/useServers"
import { useServerLogs } from "../hooks/useServerLogs"
import { useServerForm } from "../hooks/useServerForm"
import { serverService } from "../services/serverService"
import { ServerCard } from "../components/servers/ServerCard"
import { ServerForm } from "../components/servers/ServerForm"
import { ServerLogModal } from "../components/servers/ServerLogModal"
import { ServerUploadModal } from "../components/servers/ServerUploadModal"
import ServerFilterButtons from "../components/servers/ServerFilter"
import { AuthContext } from "../context/AuthContext"

export const Servers = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { user } = useContext(AuthContext)

  const { servers, loading, error, refreshServers, setError } = useServers()
  const {
    logContent,
    isConnected,
    error: logError,
    connectToLogs,
    disconnectFromLogs,
    clearLogs,
    sendCommand,
  } = useServerLogs()

  const { formData, showAdvanced, formError, handleChange, validateForm, resetForm, setShowAdvanced, setFormError } =
    useServerForm()

  const [showForm, setShowForm] = useState(false)
  const [expandedServer, setExpandedServer] = useState(null)
  const [showLogModal, setShowLogModal] = useState(false)
  const [currentServerId, setCurrentServerId] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadServerId, setUploadServerId] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" })
  const [activeFilter, setActiveFilter] = useState("all")
  const [pageLoaded, setPageLoaded] = useState(false)

  // Efecto para animación de carga de página
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  const closeNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const handleSaveServer = async () => {
    try {
      if (!validateForm()) {
        return
      }

      await serverService.createServer(formData)
      setError("")
      resetForm()
      setShowForm(false)
      refreshServers()
      showNotification("Servidor creado correctamente")
    } catch (err) {
      setFormError(err.message || "Error al crear el servidor")
      showNotification("Error al crear el servidor", "error")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este servidor?")) return
    try {
      await serverService.deleteServer(id)
      setError("")
      if (expandedServer === id) setExpandedServer(null)
      refreshServers()
      showNotification("Servidor eliminado correctamente")
    } catch (err) {
      setError(err.message)
      showNotification("Error al eliminar el servidor", "error")
    }
  }

  const handleStartServer = async (id) => {
    try {
      await serverService.startServer(id)
      setError("")
      refreshServers()
      showNotification("Servidor iniciado correctamente")
    } catch (err) {
      setError(err.message)
      showNotification("Error al iniciar el servidor", "error")
    }
  }

  const handleStopServer = async (id) => {
    try {
      await serverService.stopServer(id)
      setError("")
      refreshServers()
      showNotification("Servidor detenido correctamente")
    } catch (err) {
      setError(err.message)
      showNotification("Error al detener el servidor", "error")
    }
  }

  const handleRestartServer = async (id) => {
    try {
      await serverService.restartServer(id)
      setError("")
      refreshServers()
      showNotification("Servidor reiniciado correctamente")
    } catch (err) {
      setError(err.message)
      showNotification("Error al reiniciar el servidor", "error")
    }
  }

  const handleUploadFile = async (serverId, file) => {
    try {
      await serverService.uploadFile(serverId, file)
      setError("")
      setShowUploadModal(false)
      showNotification("Archivo subido correctamente. Reinicia el servidor para aplicar los cambios.")
    } catch (err) {
      setError(err.message)
      showNotification("Error al subir el archivo", "error")
    }
  }

  const handleServerReady = (serverId) => {
    showNotification(`¡Servidor #${serverId} listo para conectarse!`, "success")
  }

  const handleSendCommand = async (command) => {
    try {
      const result = await sendCommand(command)
      if (!result.success) {
        throw new Error(result.message)
      }
    } catch (err) {
      showNotification(`Error al enviar comando: ${err.message}`, "error")
    }
  }

  const openLogModal = (serverId) => {
    setCurrentServerId(serverId)
    setShowLogModal(true)
    // Connect to logs after setting the state
    setTimeout(() => {
      connectToLogs(serverId)
    }, 100)
  }

  const closeLogModal = () => {
    disconnectFromLogs()
    setShowLogModal(false)
    setCurrentServerId(null)
  }

  const openUploadModal = (serverId) => {
    setUploadServerId(serverId)
    setShowUploadModal(true)
  }

  const closeUploadModal = () => {
    setShowUploadModal(false)
    setUploadServerId(null)
  }

  const toggleExpanded = (id) => {
    setExpandedServer((prev) => (prev === id ? null : id))
  }

  // Filtrar servidores según el filtro activo
  const getFilteredServers = () => {
    if (!servers) return []
    if (activeFilter === "all") return servers

    // Filtros por estado
    if (activeFilter === "online") {
      return servers.filter((server) => server.status === "Activo")
    }
    if (activeFilter === "offline") {
      return servers.filter((server) => server.status !== "Activo")
    }

    // Filtros por tipo de software
    return servers.filter((server) => server.software === activeFilter)
  }

  const filteredServers = getFilteredServers()

  return (
    <Fade in={pageLoaded}>
      <Box
        sx={{
          minHeight: "100vh",
          pt: "64px",
          pb: 0,
          backgroundImage: "url(/assets/images/servers/1.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              backgroundColor: "rgba(40, 40, 40, 0.85)",
              borderRadius: 0,
              border: "4px solid #4a4a4a",
              boxShadow: "0 0 0 2px #2d2d2d",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
              <Storage sx={{ fontSize: 40, mb: 2, color: "#4CAF50" }} />
              <Typography variant="h4" sx={{ mb: 1, color: "white", textAlign: "center" }}>
                PANEL DE SERVIDORES
              </Typography>

              {user && (
                <Typography variant="subtitle1" sx={{ color: "#b0b0b0", textAlign: "center" }}>
                  Bienvenido, {user.username}. Administra tus servidores de Minecraft.
                </Typography>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, width: "100%" }}>
                {error}
              </Alert>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "stretch" : "center",
                mb: 3,
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowForm(true)}
                fullWidth={isMobile}
                sx={{
                  borderRadius: 0,
                  border: "2px solid #4a4a4a",
                  boxShadow: "0 0 0 1px #2d2d2d",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  "&:hover": { backgroundColor: "#3d8b40" },
                  py: 1.2,
                }}
              >
                Crear Nuevo Servidor
              </Button>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refreshServers}
                fullWidth={isMobile}
                sx={{
                  borderRadius: 0,
                  border: "2px solid #4a4a4a",
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  py: 1.2,
                }}
              >
                Actualizar Lista
              </Button>
            </Box>

            {showForm && (
              <ServerForm
                formData={formData}
                showAdvanced={showAdvanced}
                onChange={handleChange}
                onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
                onSubmit={handleSaveServer}
                onCancel={() => {
                  resetForm()
                  setShowForm(false)
                }}
                formError={formError}
              />
            )}

            <Box mt={5}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: "white",
                  borderBottom: "2px solid #4CAF50",
                  pb: 1,
                  display: "inline-block",
                }}
              >
                MIS SERVIDORES
              </Typography>

              {/* Botones de filtrado */}
              <ServerFilterButtons activeFilter={activeFilter} onFilterChange={setActiveFilter} />

              {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress sx={{ color: "#4CAF50" }} />
                </Box>
              ) : servers.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    color: "white",
                    border: "1px dashed #4a4a4a",
                    mt: 3,
                  }}
                >
                  <Typography variant="h6">No hay servidores disponibles</Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: "#b0b0b0" }}>
                    Crea tu primer servidor usando el botón "Crear Nuevo Servidor"
                  </Typography>
                </Box>
              ) : filteredServers.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    color: "white",
                    border: "1px dashed #4a4a4a",
                    mt: 3,
                  }}
                >
                  <Typography variant="h6">No hay servidores que coincidan con el filtro</Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: "#b0b0b0" }}>
                    Prueba con otro filtro o crea un nuevo servidor
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredServers.map((server) => (
                    <Grid item xs={12} sm={6} lg={4} key={server.id}>
                      <ServerCard
                        server={server}
                        expanded={expandedServer === server.id}
                        onToggleExpand={toggleExpanded}
                        onStart={handleStartServer}
                        onStop={handleStopServer}
                        onRestart={handleRestartServer}
                        onDelete={handleDelete}
                        onShowLogs={openLogModal}
                        onUploadFile={openUploadModal}
                        onServerReady={handleServerReady}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>

            <ServerLogModal
              open={showLogModal}
              onClose={closeLogModal}
              serverId={currentServerId}
              logContent={logContent}
              isConnected={isConnected}
              error={logError}
              onReconnect={() => {
                if (currentServerId) {
                  connectToLogs(currentServerId)
                }
              }}
              onClearLogs={clearLogs}
              onSendCommand={handleSendCommand}
            />

            <ServerUploadModal
              open={showUploadModal}
              onClose={closeUploadModal}
              serverId={uploadServerId}
              onUpload={handleUploadFile}
            />

            <Snackbar
              open={notification.open}
              autoHideDuration={6000}
              onClose={closeNotification}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: "100%" }}>
                {notification.message}
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      </Box>
    </Fade>
  )
}
