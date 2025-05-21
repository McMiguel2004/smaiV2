import { Box } from "@mui/material"
import { Link } from "react-router-dom"

/**
 * Componente Logo - Muestra el logo de la aplicación
 */
const Logo = () => (
  <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
    <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
      <Box
        component="img"
        src="/assets/images/navbar/smai.png"
        alt="Logo"
        sx={{
          height: 40,
          filter: "drop-shadow(0 0 4px rgba(76, 175, 80, 0.5))",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            filter: "drop-shadow(0 0 8px rgba(76, 175, 80, 0.8))",
            transform: "scale(1.05)",
          },
        }}
      />
    </Link>
  </Box>
)

export default Logo
