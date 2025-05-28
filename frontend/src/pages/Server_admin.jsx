// src/pages/server_admin.jsx
"use client"

import { useParams, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

import { ServerStatus } from "../components/servers/ServerStatus"
import { ServerStartupMonitor } from "../components/servers/ServerStartupMonitor"
import { serverService } from "../services/serverService"
import { DockerView } from "../components/servers/admin/DockerView"
import { ServerSettings } from "../components/servers/admin/ServerSettings"
import { WorldManage } from "../components/servers/admin/WorldManage"
import { Players } from "../components/servers/admin/Players"

export function ServerAdmin() {
  const { name } = useParams()
  const { state } = useLocation()
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down("sm"))

  const [server, setServer] = useState(state?.server || null)
  const [loading, setLoading] = useState(!server)
  const [tabIndex, setTabIndex] = useState(0)
  const [showAlert, setShowAlert] = useState(true)

  // Ocultar alerta tras 1 minuto
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false)
    }, 60000) // 60 segundos

    return () => clearTimeout(timer)
  }, [])

  const sections = [
    { label: "🐳 Docker", component: <DockerView server={server} /> },
    { label: "⚙️ Configuración", component: <ServerSettings server={server} /> },
    { label: "🌍 World", component: <WorldManage server={server} /> },
    { label: "👥 Jugadores", component: <Players server={server} /> },
    { label: "📦 Backup & Control", component: <Box>Backup & Control...</Box> },
  ]

  useEffect(() => {
    if (!server && name) {
      setLoading(true)
      serverService
        .getByName(name)
        .then((srv) => setServer(srv))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [name, server])

  const bg = {
    backgroundImage: "url(/assets/images/servers/mina.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }

  if (loading || !server) {
    return (
      <Box
        sx={{
          ...bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: { xs: 10, sm: 8 },
          pb: { xs: 6, sm: 8 },
        }}
      >
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          <Typography
            variant="h6"
            sx={{ color: "white", fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Servidor “{name}” no encontrado.
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        ...bg,
        minHeight: "100vh",
        pt: { xs: 10, sm: 8 },
        pb: { xs: 6, sm: 8 },
      }}
    >
      <Container
        maxWidth="md"
        disableGutters={isXs}
        sx={{ px: { xs: 2, sm: 0 } }}
      >
        <Paper
          elevation={6}
          sx={{
            mt: { xs: 4, sm: 4 },
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: "#1e1e1e",
            border: "2px solid #4a4a4a",
            boxShadow: "0 0 10px #000",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "white",
              mb: { xs: 2, sm: 3 },
              textAlign: "center",
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
            }}
          >
            Panel Avanzado: “{server.name}”
          </Typography>

          {/* Alerta superior */}
          <Collapse in={showAlert}>
            <Alert
              severity="info"
              variant="filled"
              sx={{
                mb: 2,
                backgroundColor: "#1976d2",
                color: "white",
                fontSize: { xs: "0.85rem", sm: "1rem" },
              }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowAlert(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Todas las siguientes funcionalidades funcionan únicamente si el servidor está activo.{" "}
              <strong>Recomendamos reiniciar el servidor después de cada uso de una funcionalidad.</strong>
            </Alert>
          </Collapse>

          {isXs ? (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "white" }}>Sección</InputLabel>
              <Select
                value={tabIndex}
                label="Sección"
                onChange={(e) => setTabIndex(e.target.value)}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": { borderColor: "#4a4a4a" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                  ".MuiSvgIcon-root": { color: "white" },
                }}
              >
                {sections.map((s, idx) => (
                  <MenuItem key={idx} value={idx}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Tabs
              value={tabIndex}
              onChange={(_, idx) => setTabIndex(idx)}
              indicatorColor="primary"
              textColor="inherit"
              variant="scrollable"
              scrollButtons="on"
              allowScrollButtonsMobile
              sx={{
                mb: { xs: 1, sm: 2 },
                "& .MuiTabs-flexContainer": { flexWrap: "nowrap" },
                "& .MuiTab-root": {
                  color: "white",
                  minWidth: { xs: 80, sm: 100 },
                  fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" },
                },
              }}
            >
              {sections.map((s, idx) => (
                <Tab key={idx} label={s.label} />
              ))}
            </Tabs>
          )}

          <Box sx={{ mt: 2 }}>
            {sections[tabIndex].component}
            {tabIndex === 4 && (
              <Box sx={{ color: "white", mt: { xs: 1, sm: 2 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  Estado del servidor
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    alignItems: "center",
                    mb: { xs: 1, sm: 2 },
                  }}
                >
                  <ServerStatus status={server.status} />
                  <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                    IP: {server.ip_address}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                    Puerto: {server.port}
                  </Typography>
                </Box>
                <ServerStartupMonitor server={server} onReady={() => {}} />
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ServerAdmin
