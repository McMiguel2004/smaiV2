"use client"

import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material"
import { Link } from "react-router-dom"
import { Login, PersonAdd, Logout, Dashboard } from "@mui/icons-material"

/**
 * Componente AccountMenu - Menú desplegable para opciones de cuenta
 * @param {Object} props - Propiedades del componente
 * @param {HTMLElement} props.anchorEl - Elemento de anclaje para el menú
 * @param {function} props.onClose - Función para cerrar el menú
 * @param {boolean} props.isAuthenticated - Estado de autenticación
 * @param {function} props.handleLogout - Función para cerrar sesión
 */
const AccountMenu = ({ anchorEl, onClose, isAuthenticated, handleLogout }) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    sx={{
      "& .MuiPaper-root": {
        backgroundColor: "#1e1e1e",
        color: "white",
        borderRadius: 0,
        border: "2px solid #4a4a4a",
        boxShadow: "5px 5px 0px rgba(0,0,0,0.2)",
      },
    }}
  >
    {!isAuthenticated
      ? [
          <MenuItem
            key="login"
            component={Link}
            to="/login"
            sx={{
              fontFamily: '"Minecraft-Seven", sans-serif',
              "&:hover": { backgroundColor: "#333" },
              padding: "10px 16px",
            }}
          >
            <ListItemIcon>
              <Login sx={{ color: "#4CAF50" }} />
            </ListItemIcon>
            <ListItemText primary="Iniciar Sesión" />
          </MenuItem>,
          <MenuItem
            key="register"
            component={Link}
            to="/register"
            sx={{
              fontFamily: '"Minecraft-Seven", sans-serif',
              "&:hover": { backgroundColor: "#333" },
              padding: "10px 16px",
            }}
          >
            <ListItemIcon>
              <PersonAdd sx={{ color: "#4CAF50" }} />
            </ListItemIcon>
            <ListItemText primary="Registrar" />
          </MenuItem>,
        ]
      : [
          <MenuItem
            key="dashboard"
            component={Link}
            to="/servers"
            sx={{
              fontFamily: '"Minecraft-Seven", sans-serif',
              "&:hover": { backgroundColor: "#333" },
              padding: "10px 16px",
            }}
          >
            <ListItemIcon>
              <Dashboard sx={{ color: "#2196F3" }} />
            </ListItemIcon>
            <ListItemText primary="Mi Panel" />
          </MenuItem>,
          <MenuItem
            key="logout"
            onClick={handleLogout}
            sx={{
              fontFamily: '"Minecraft-Seven", sans-serif',
              "&:hover": { backgroundColor: "#333" },
              padding: "10px 16px",
            }}
          >
            <ListItemIcon>
              <Logout sx={{ color: "#f44336" }} />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </MenuItem>,
        ]}
  </Menu>
)

export default AccountMenu
