"use client"

import { useState, useEffect, useContext } from "react"
import { AppBar, Toolbar, Box, useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"

import Logo from "./Logo"
import CenterButtons from "./CenterButtons"
import AccountIcon from "./AccountIcon"
import AccountMenu from "./AccountMenu"
import MobileMenu from "./MobileMenu"
import { AuthContext } from "../../context/AuthContext"

/**
 * Componente Navbar - Barra de navegación principal de la aplicación
 * Gestiona la navegación entre páginas y muestra opciones según el estado de autenticación
 */
const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Usar el contexto de autenticación en lugar de estado local
  const { isAuthenticated, user, logout } = useContext(AuthContext)

  // Efecto para detectar el scroll y cambiar el estilo de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
    setAnchorEl(null)
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: isScrolled ? "rgba(38, 36, 35, 0.95)" : "rgba(38, 36, 35, 0.7)",
        borderBottom: "1px solid #333",
        boxShadow: isScrolled ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none",
        height: "64px",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        zIndex: 1000,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Logo />
        <CenterButtons />

        {isMobile ? (
          <MobileMenu isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        ) : (
          <Box>
            <AccountIcon
              username={user?.username || "Cuenta"}
              isAuthenticated={isAuthenticated}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            />
            <AccountMenu
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
