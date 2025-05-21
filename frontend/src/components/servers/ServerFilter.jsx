"use client"
import { Box, Button, Fade } from "@mui/material"
import { useState, useEffect } from "react"

const ServerFilterButtons = ({ activeFilter, onFilterChange }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Opciones de filtro disponibles
  const filterOptions = [
    { id: "all", label: "Todos" },
    { id: "online", label: "Online", statusFilter: "Activo" },
    { id: "offline", label: "Offline", statusFilter: "Detenido" },
    { id: "Java", label: "Java", softwareFilter: "Java" },
    { id: "Forge", label: "Forge", softwareFilter: "Forge" },
    { id: "Fabric", label: "Fabric", softwareFilter: "Fabric" },
    { id: "Modpack", label: "Modpack", softwareFilter: "Modpack" },
  ]

  return (
    <Fade in={isVisible} timeout={800}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 3,
          mt: 2,
        }}
      >
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeFilter === option.id ? "contained" : "outlined"}
            onClick={() => onFilterChange(option.id)}
            sx={{
              borderRadius: 0,
              backgroundColor: activeFilter === option.id ? getButtonColor(option.id) : "transparent",
              borderColor: getButtonColor(option.id),
              color: activeFilter === option.id ? "#fff" : getButtonColor(option.id),
              "&:hover": {
                backgroundColor:
                  activeFilter === option.id ? getButtonColor(option.id) : `${getButtonColor(option.id)}22`,
                transform: activeFilter === option.id ? "none" : "translateY(-2px)",
              },
              textTransform: "none",
              minWidth: "80px",
              transition: "all 0.2s ease",
              px: 2,
              py: 0.8,
              fontWeight: 500,
            }}
          >
            {option.label}
          </Button>
        ))}
      </Box>
    </Fade>
  )
}

// Función para obtener el color del botón según el tipo de filtro
const getButtonColor = (filterId) => {
  switch (filterId) {
    case "online":
      return "#4CAF50" // Verde
    case "offline":
      return "#F44336" // Rojo
    case "Java":
      return "#4CAF50" // Verde
    case "Forge":
      return "#ce422b" // Rojo anaranjado
    case "Fabric":
      return "#b0d0f0" // Azul claro
    case "Modpack":
      return "#ffc107" // Amarillo
    default:
      return "#4a4a4a" // Gris para "Todos"
  }
}

export default ServerFilterButtons
