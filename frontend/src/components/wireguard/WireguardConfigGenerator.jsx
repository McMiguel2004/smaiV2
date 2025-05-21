"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Snackbar,
  Card,
  CardContent,
  Grid,
} from "@mui/material"
import { VpnKey, Download, Refresh, CheckCircle, Error as ErrorIcon, Lock } from "@mui/icons-material"

const WireguardConfigGenerator = () => {
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [config, setConfig] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          setIsAuthenticated(true)
          // If authenticated, check for existing config
          checkExistingConfig()
        } else {
          setIsAuthenticated(false)
        }
      } catch (err) {
        console.error("Error checking authentication:", err)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // Check if user already has a configuration
  const checkExistingConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/wireguard/generate", {
        method: "POST",
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setConfig({
          config: data.config,
          ip: data.ip,
        })
      }
    } catch (err) {
      console.error("Error checking existing config:", err)
    } finally {
      setLoading(false)
    }
  }

  // Generate new configuration
  const handleGenerateConfig = async () => {
    if (!isAuthenticated) {
      setNotification({
        open: true,
        message: "Debes iniciar sesión para generar una configuración",
        severity: "error",
      });
      return;
    }
  
    if (config) {
      const confirmRegenerate = window.confirm(
        "¿Estás seguro de que quieres regenerar tu configuración VPN? " +
        "Esto invalidará tu configuración actual."
      );
      if (!confirmRegenerate) return;
    }
  
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/wireguard/generate", {
        method: "POST",
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate configuration")
      }

      setConfig({
        config: data.config,
        ip: data.ip,
      })

      setNotification({
        open: true,
        message: "WireGuard configuration generated successfully!",
        severity: "success",
      })
    } catch (err) {
      setError(err.message)
      setNotification({
        open: true,
        message: `Error: ${err.message}`,
        severity: "error",
      })
    } finally {
      setGenerating(false)
    }
  }

  // Download configuration
  const handleDownloadConfig = async () => {
    if (!isAuthenticated) {
      setNotification({
        open: true,
        message: "Debes iniciar sesión para descargar la configuración",
        severity: "error",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/wireguard/download", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to download configuration")
      }

      // Create a blob from the response
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link and click it to download
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = "smai_vpn.conf"
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setNotification({
        open: true,
        message: "Configuration downloaded successfully!",
        severity: "success",
      })
    } catch (err) {
      setError(err.message)
      setNotification({
        open: true,
        message: `Error: ${err.message}`,
        severity: "error",
      })
    }
  }

  const closeNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const handleLogin = () => {
    navigate("/login")
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <Box sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: "rgba(40, 40, 40, 0.85)",
            borderRadius: 0,
            border: "4px solid #4a4a4a",
            boxShadow: "0 0 0 2px #2d2d2d",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Lock sx={{ fontSize: 40, mr: 2, color: "#f44336" }} />
            <Typography variant="h5" component="h2" sx={{ color: "white" }}>
              Acceso Restringido
            </Typography>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            Debes iniciar sesión para generar y descargar tu configuración de WireGuard VPN.
          </Alert>

          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              borderRadius: 0,
              border: "2px solid #4a4a4a",
              boxShadow: "0 0 0 1px #2d2d2d",
              fontWeight: "bold",
              textTransform: "uppercase",
              backgroundColor: "#4CAF50",
              color: "white",
              "&:hover": { backgroundColor: "#3d8b40" },
            }}
          >
            Iniciar Sesión
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: "rgba(40, 40, 40, 0.85)",
          borderRadius: 0,
          border: "4px solid #4a4a4a",
          boxShadow: "0 0 0 2px #2d2d2d",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <VpnKey sx={{ fontSize: 40, mr: 2, color: "#4CAF50" }} />
          <Typography variant="h5" component="h2" sx={{ color: "white" }}>
            WireGuard VPN Configuration
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, backgroundColor: "#4a4a4a" }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress sx={{ color: "#4CAF50" }} />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {config ? (
              <Box>
                <Alert icon={<CheckCircle fontSize="inherit" />} severity="success" sx={{ mb: 3 }}>
                  Your WireGuard configuration is ready!
                </Alert>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: "rgba(0,0,0,0.3)", color: "white" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Your VPN Details
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>IP Address:</strong> {config.ip}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Status:</strong> Ready to connect
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: "rgba(0,0,0,0.3)", color: "white", height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Next Steps
                        </Typography>
                        <Typography variant="body2" paragraph>
                          1. Download your configuration file
                        </Typography>
                        <Typography variant="body2" paragraph>
                          2. Import it into your WireGuard client
                        </Typography>
                        <Typography variant="body2">3. Connect to the VPN</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownloadConfig}
                  sx={{
                    borderRadius: 0,
                    border: "2px solid #4a4a4a",
                    boxShadow: "0 0 0 1px #2d2d2d",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    "&:hover": { backgroundColor: "#3d8b40" },
                    mr: 2,
                  }}
                >
                  Download Configuration
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleGenerateConfig}
                  disabled={generating}
                  sx={{
                    borderRadius: 0,
                    border: "2px solid #4a4a4a",
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  {generating ? "Generating..." : "Regenerate"}
                </Button>
              </Box>
            ) : (
              <Box>
                <Alert icon={<ErrorIcon fontSize="inherit" />} severity="info" sx={{ mb: 3 }}>
                  You don't have a WireGuard configuration yet. Generate one to connect to the VPN.
                </Alert>

                <Button
                  variant="contained"
                  startIcon={<VpnKey />}
                  onClick={handleGenerateConfig}
                  disabled={generating}
                  sx={{
                    borderRadius: 0,
                    border: "2px solid #4a4a4a",
                    boxShadow: "0 0 0 1px #2d2d2d",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    "&:hover": { backgroundColor: "#3d8b40" },
                  }}
                >
                  {generating ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1, color: "white" }} />
                      Generating...
                    </>
                  ) : (
                    "Generate Configuration"
                  )}
                </Button>
              </Box>
            )}
          </>
        )}
      </Paper>

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
    </Box>
  )
}

export default WireguardConfigGenerator
