"use client"

import { Box, Tooltip } from "@mui/material"
import { useState, useEffect } from "react"

export const ServerStatus = ({ status }) => {
  const [isBlinking, setIsBlinking] = useState(status === "Activo")

  useEffect(() => {
    // Solo aplicar animación de parpadeo al estado activo
    setIsBlinking(status === "Activo")
  }, [status])

  return (
    <Tooltip title={status === "Activo" ? "Servidor en línea" : "Servidor detenido"} arrow>
      <Box
        component="span"
        sx={{
          color: status === "Activo" ? "#4CAF50" : "#f44336",
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontWeight: 500,
          "&::before": {
            content: '""',
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: status === "Activo" ? "#4CAF50" : "#f44336",
            animation: isBlinking ? "pulse 1.5s infinite" : "none",
            "@keyframes pulse": {
              "0%": {
                boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)",
              },
              "70%": {
                boxShadow: "0 0 0 6px rgba(76, 175, 80, 0)",
              },
              "100%": {
                boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)",
              },
            },
          },
        }}
      >
        {status === "Activo" ? "ONLINE" : "OFFLINE"}
      </Box>
    </Tooltip>
  )
}
