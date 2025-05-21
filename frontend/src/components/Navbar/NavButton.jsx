import { Button } from "@mui/material"
import { Link } from "react-router-dom"

/**
 * Componente NavButton - Botón de navegación personalizado
 * @param {Object} props - Propiedades del componente
 * @param {string} props.to - Ruta de destino
 * @param {React.ReactNode} props.icon - Icono del botón
 * @param {React.ReactNode} props.children - Contenido del botón
 */
const NavButton = ({ to, icon, children }) => (
  <Button
    component={Link}
    to={to}
    startIcon={icon}
    sx={{
      color: "white",
      fontFamily: '"Minecraft-Seven", sans-serif',
      letterSpacing: "1px",
      borderRadius: 0,
      border: "2px solid #4a4a4a",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      boxShadow: "3px 3px 0px #4CAF50",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        transform: "translate(1px, 1px)",
        boxShadow: "2px 2px 0px #2E7D32",
      },
      "&:active": {
        transform: "translate(3px, 3px)",
        boxShadow: "0px 0px 0px #2E7D32",
      },
      transition: "all 0.1s ease",
      px: { xs: 1, sm: 1.5, md: 2 },
      py: 1,
      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
    }}
  >
    {children}
  </Button>
)

export default NavButton
