"use client"

import { useState, useEffect } from "react"
import { Box, LinearProgress, Typography, Alert } from "@mui/material"

// Startup time thresholds in seconds
const STARTUP_THRESHOLDS = {
  java: 60, // 1 minute
  forge: 90, // 1 minute 30 seconds
  fabric: 90, // 1 minute 30 seconds
  modpack: 120, // 2 minutes
}

export const ServerStartupMonitor = ({ server, onReady }) => {
  const [progress, setProgress] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Iniciando servidor...")

  // Get the appropriate threshold based on server type
  const getThreshold = (type) => {
    const serverType = type.toLowerCase()
    return STARTUP_THRESHOLDS[serverType] || STARTUP_THRESHOLDS.java
  }

  // Check server status
  useEffect(() => {
    if (!server || server.status !== "Activo") {
      setStartTime(null)
      setProgress(0)
      setShowAlert(false)
      setIsReady(false)
      return
    }

    // Initialize start time if not set
    if (!startTime) {
      setStartTime(Date.now())
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/servers/server_startup_status/${server.id}`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch server status")
        }

        const data = await response.json()

        // Update progress and message
        if (data.progress) {
          setProgress(data.progress)
        }

        if (data.message) {
          setStatusMessage(data.message)
        }

        // Check if server is ready
        if (data.ready) {
          setIsReady(true)
          if (onReady) onReady(server.id)
        }

        // Show alert if taking too long
        const threshold = getThreshold(data.server_type || server.software)
        if (!data.ready && (Date.now() - startTime) / 1000 > threshold) {
          setShowAlert(true)
        }
      } catch (error) {
        console.error("Error checking server status:", error)
      }
    }

    // Check status every 3 seconds
    const interval = setInterval(checkStatus, 3000)
    return () => clearInterval(interval)
  }, [server, startTime, onReady])

  if (!server || server.status !== "Activo" || isReady) {
    return null
  }

  return (
    <Box sx={{ mt: 2, mb: showAlert ? 0 : 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="body2" color="white">
          {statusMessage}
        </Typography>
        <Typography variant="body2" color="white">
          {progress}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 1,
          backgroundColor: "rgba(255,255,255,0.1)",
          "& .MuiLinearProgress-bar": {
            backgroundColor: progress < 70 ? "#4CAF50" : progress < 90 ? "#FFC107" : "#F44336",
          },
        }}
      />

      {showAlert && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          El servidor está tardando más de lo esperado en iniciar. Esto es normal para servidores {server.software}, que
          pueden tardar hasta {getThreshold(server.software.toLowerCase()) / 60} minutos en iniciar completamente.
        </Alert>
      )}
    </Box>
  )
}
