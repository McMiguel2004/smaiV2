"use client"
import { Box, Chip, Typography } from "@mui/material"

// Lista de comandos comunes de Minecraft
const COMMON_COMMANDS = [
  { command: "help", description: "Muestra la ayuda del servidor" },
  { command: "list", description: "Lista los jugadores conectados" },
  { command: "time set day", description: "Establece el tiempo a día" },
  { command: "time set night", description: "Establece el tiempo a noche" },
  { command: "weather clear", description: "Establece el clima a despejado" },
  { command: "weather rain", description: "Establece el clima a lluvia" },
  { command: "gamemode creative", description: "Cambia al modo creativo" },
  { command: "gamemode survival", description: "Cambia al modo supervivencia" },
  { command: "difficulty peaceful", description: "Establece la dificultad a pacífica" },
  { command: "difficulty easy", description: "Establece la dificultad a fácil" },
  { command: "difficulty normal", description: "Establece la dificultad a normal" },
  { command: "difficulty hard", description: "Establece la dificultad a difícil" },
  { command: "op", description: "Da permisos de operador a un jugador" },
  { command: "deop", description: "Quita permisos de operador a un jugador" },
  { command: "kick", description: "Expulsa a un jugador del servidor" },
  { command: "ban", description: "Prohíbe a un jugador entrar al servidor" },
  { command: "pardon", description: "Permite a un jugador baneado volver a entrar" },
  { command: "save-all", description: "Guarda el mundo" },
  { command: "stop", description: "Detiene el servidor" },
]

export const CommandSuggestions = ({ onSelectCommand }) => {
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
        Comandos sugeridos:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {COMMON_COMMANDS.slice(0, 10).map((cmd) => (
          <Chip
            key={cmd.command}
            label={cmd.command}
            onClick={() => onSelectCommand(cmd.command)}
            sx={{
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              color: "#4CAF50",
              border: "1px solid #4CAF50",
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.3)",
              },
            }}
            title={cmd.description}
          />
        ))}
      </Box>
    </Box>
  )
}
