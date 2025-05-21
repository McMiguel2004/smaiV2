"use client"

import { useState } from "react"
import { Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material"
import {
  Menu as MenuIcon,
  Home,
  Storage,
  Person,
  VpnKey,
  Login,
  PersonAdd,
  Logout,
  Dashboard,
} from "@mui/icons-material"
import { Link } from "react-router-dom"

/**
 * Componente MobileMenu - Menú móvil para pantallas pequeñas
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isAuthenticated - Estado de autenticación
 * @param {function} props.handleLogout - Función para cerrar sesión
 */
const MobileMenu = ({ isAuthenticated, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return
    }
    setIsOpen(open)
  }

  return (
    <Box sx={{ display: { xs: "block", sm: "none" } }}>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ color: "white" }}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#1e1e1e",
            color: "white",
            borderLeft: "2px solid #4a4a4a",
          },
        }}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <Box sx={{ p: 2, borderBottom: "1px solid #4a4a4a" }}>
            <Typography variant="h6" sx={{ fontFamily: '"Minecraft-Seven", sans-serif', color: "#4CAF50" }}>
              Minecraft Servers
            </Typography>
          </Box>

          <List>
            <ListItem button component={Link} to="/" sx={{ fontFamily: '"Minecraft-Seven", sans-serif' }}>
              <ListItemIcon>
                <Home sx={{ color: "#4CAF50" }} />
              </ListItemIcon>
              <ListItemText primary="Home" sx={{ color: "white" }} />
            </ListItem>
            <ListItem button component={Link} to="/servers" sx={{ fontFamily: '"Minecraft-Seven", sans-serif' }}>
              <ListItemIcon>
                <Storage sx={{ color: "#4CAF50" }} />
              </ListItemIcon>
              <ListItemText primary="Servers" sx={{ color: "white" }} />
            </ListItem>
            <ListItem button component={Link} to="/skins" sx={{ fontFamily: '"Minecraft-Seven", sans-serif' }}>
              <ListItemIcon>
                <Person sx={{ color: "#4CAF50" }} />
              </ListItemIcon>
              <ListItemText primary="Skins" sx={{ color: "white" }} />
            </ListItem>
            <ListItem button component={Link} to="/wireguard" sx={{ fontFamily: '"Minecraft-Seven", sans-serif' }}>
              <ListItemIcon>
                <VpnKey sx={{ color: "#4CAF50" }} />
              </ListItemIcon>
              <ListItemText primary="WireGuard" sx={{ color: "white" }} />
            </ListItem>
          </List>
          <Divider sx={{ backgroundColor: "#4a4a4a" }} />
          <List>
            {!isAuthenticated ? (
              <>
                <ListItem button component={Link} to="/login" sx={{ fontFamily: '"Minecraft-Seven", sans-serif' }}>
                  <ListItemIcon>
                    <Login sx={{ color: "#4CAF50" }} />
                  </ListItemIcon>
                  <ListItemText primary="Iniciar Sesión" sx={{ color: "white" }} />
                </ListItem>
                <ListItem button component={Link} to="/register" sx={{ fontFamily: '"Minecraft-Seven", sans-serif' }}>
                  <ListItemIcon>
                    <PersonAdd sx={{ color: "#4CAF50" }} />
                  </ListItemIcon>
                  <ListItemText primary="Registrar" sx={{ color: "white" }} />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/servers" sx={{ fontFamily: '"Minecraft-Seven", sans-serif' }}>
                  <ListItemIcon>
                    <Dashboard sx={{ color: "#2196F3" }} />
                  </ListItemIcon>
                  <ListItemText primary="Mi Panel" sx={{ color: "white" }} />
                </ListItem>
                <ListItem button onClick={handleLogout} sx={{ fontFamily: '"Minecraft-Seven", sans-serif' }}>
                  <ListItemIcon>
                    <Logout sx={{ color: "#f44336" }} />
                  </ListItemIcon>
                  <ListItemText primary="Cerrar Sesión" sx={{ color: "white" }} />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

export default MobileMenu
