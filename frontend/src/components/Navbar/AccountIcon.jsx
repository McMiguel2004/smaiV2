"use client"

import { Box, IconButton, Typography } from "@mui/material"
import { AccountCircle } from "@mui/icons-material"

/**
 * Componente AccountIcon - Muestra el icono de la cuenta y el saludo al usuario
 * @param {Object} props - Propiedades del componente
 * @param {string} props.username - Nombre de usuario
 * @param {boolean} props.isAuthenticated - Estado de autenticación
 * @param {function} props.onClick - Función para manejar el clic
 */
const AccountIcon = ({ username, isAuthenticated, onClick }) => (
  <Box sx={{ display: "flex", alignItems: "center", height: "100%", gap: 2 }}>
    {isAuthenticated && (
      <Typography
        variant="body1"
        sx={{
          color: "white",
          fontFamily: '"Minecraft-Seven", sans-serif',
          textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
        }}
      >
        Hola, {username}
      </Typography>
    )}
    <IconButton
      onClick={onClick}
      sx={{
        color: "#b1a8a5",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          transform: "scale(1.1)",
        },
        transition: "all 0.2s ease",
      }}
    >
      <AccountCircle fontSize="large" />
    </IconButton>
  </Box>
)

export default AccountIcon
