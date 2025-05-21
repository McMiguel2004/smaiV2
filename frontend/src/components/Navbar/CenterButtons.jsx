import { Box } from "@mui/material"
import { Home, Storage, Person, VpnKey } from "@mui/icons-material"
import NavButton from "./NavButton"

/**
 * Componente CenterButtons - Botones centrales de navegación
 */
const CenterButtons = () => (
  <Box
    sx={{
      position: { xs: "static", md: "absolute" },
      left: "50%",
      transform: { xs: "none", md: "translateX(-50%)" },
      height: "100%",
      display: { xs: "none", sm: "flex" },
      alignItems: "center",
      gap: { sm: "10px", md: "20px" },
      justifyContent: "center",
    }}
  >
    <NavButton to="/" icon={<Home />}>
      Home
    </NavButton>
    <NavButton to="/servers" icon={<Storage />}>
      Servers
    </NavButton>
    <NavButton to="/skins" icon={<Person />}>
      Skins
    </NavButton>
    <NavButton to="/wireguard" icon={<VpnKey />}>
      WireGuard
    </NavButton>
  </Box>
)

export default CenterButtons
