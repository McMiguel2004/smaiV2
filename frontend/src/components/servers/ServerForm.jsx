"use client"
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
  Collapse,
  Alert,
} from "@mui/material"
import { Add, Close, Settings } from "@mui/icons-material"

const softwareOptions = ["Java", "Forge", "Fabric", "Spigot", "Bukkit", "Modpack"]
const versionOptions = ["1.20.6", "1.20.5", "1.20.4", "1.20.1", "1.19.4", "1.18.2", "1.16.5", "1.12.2", "1.8.9"]
const difficultyOptions = [
  ["PEACEFUL", "Pacífico"],
  ["EASY", "Fácil"],
  ["NORMAL", "Normal"],
  ["HARD", "Difícil"],
]
const modeOptions = [
  ["SURVIVAL", "Supervivencia"],
  ["CREATIVE", "Creativo"],
  ["ADVENTURE", "Aventura"],
  ["SPECTATOR", "Espectador"],
]

const switchOptions = [
  ["spawnNpcs", "Generar aldeanos"],
  ["allowNether", "Permitir Nether"],
  ["spawnAnimals", "Generar animales"],
  ["spawnMonsters", "Generar monstruos"],
  ["pvp", "Permitir PvP"],
  ["enableCommandBlock", "Bloques de comandos"],
  ["allowFlight", "Permitir vuelo"],
]

const formStyles = {
  paper: {
    p: 4,
    backgroundColor: "rgba(40, 40, 40, 0.85)",
    borderRadius: 0,
    border: "4px solid #4a4a4a",
    boxShadow: "0 0 0 2px #2d2d2d",
    mb: 4,
  },
  text: { color: "white" },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    "& .MuiInputLabel-root": { color: "#aaa" },
    "& .MuiInputBase-input": { color: "white" },
  },
  button: {
    borderRadius: 0,
    border: "2px solid #4a4a4a",
    boxShadow: "0 0 0 1px #2d2d2d",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    "&:hover": { backgroundColor: "#3d8b40" },
  },
  dangerButton: {
    backgroundColor: "#f44336",
    color: "white",
    "&:hover": { backgroundColor: "#d32f2f" },
  },
}

export const ServerForm = ({ formData, showAdvanced, onChange, onToggleAdvanced, onSubmit, onCancel, formError }) => {
  // Validate CurseForge URL
  const isValidCurseForgeUrl = (url) => {
    if (!url) return true // Empty is valid (not required)
    return /^https?:\/\/www\.curseforge\.com\/minecraft\/modpacks\/[^/]+(\/?|\/files\/\d+\/?|\/download\/\d+\/?)?$/.test(
      url,
    ) 
  }

  const modpackUrlError = formData.software === "Modpack" && formData.modpack && !isValidCurseForgeUrl(formData.modpack)

  return (
    <Paper sx={formStyles.paper}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, ...formStyles.text }}>
          CREAR NUEVO SERVIDOR
        </Typography>
      </Box>

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Nombre del Servidor"
        name="nombreServidor"
        value={formData.nombreServidor}
        onChange={onChange}
        sx={formStyles.input}
        required
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: "#aaa" }}>Software</InputLabel>
            <Select name="software" value={formData.software} onChange={onChange} sx={formStyles.input}>
              {softwareOptions.map((s) => (
                <MenuItem key={s} value={s} sx={{ backgroundColor: "#333" }}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.software === "Modpack" && (
            <TextField
              fullWidth
              margin="normal"
              label="URL del Modpack de CurseForge"
              name="modpack"
              value={formData.modpack}
              onChange={onChange}
              sx={formStyles.input}
              error={modpackUrlError}
              helperText={
                modpackUrlError
                  ? "Introduce una URL válida de CurseForge (ej: https://www.curseforge.com/minecraft/modpacks/all-the-mods-8)"
                  : ""
              }
              required
            />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: "#aaa" }}>Versión</InputLabel>
            <Select
              name="version"
              value={formData.version}
              onChange={onChange}
              sx={formStyles.input}
              disabled={formData.software === "Modpack"} // Disable version selection for modpacks
            >
              {versionOptions.map((v) => (
                <MenuItem key={v} value={v} sx={{ backgroundColor: "#333" }}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formData.software === "Modpack" && (
            <Typography variant="caption" sx={{ color: "#aaa", mt: 1, display: "block" }}>
              * La versión se determinará automáticamente según el modpack seleccionado
            </Typography>
          )}
        </Grid>
      </Grid>

      <Box
        mt={2}
        onClick={onToggleAdvanced}
        sx={{
          cursor: "pointer",
          color: "#4CAF50",
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <Settings sx={{ mr: 1 }} /> Opciones avanzadas
      </Box>

      <Collapse in={showAdvanced}>
        <Box mt={2} p={2} sx={{ backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#4CAF50" }}>
            Configuración Avanzada
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                margin="normal"
                label="Máximo de Jugadores"
                type="number"
                name="maxPlayers"
                value={formData.maxPlayers}
                onChange={onChange}
                sx={formStyles.input}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ color: "#aaa" }}>Dificultad</InputLabel>
                <Select name="difficulty" value={formData.difficulty} onChange={onChange} sx={formStyles.input}>
                  {difficultyOptions.map(([value, label]) => (
                    <MenuItem key={value} value={value} sx={{ backgroundColor: "#333" }}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ color: "#aaa" }}>Modo de Juego</InputLabel>
                <Select name="mode" value={formData.mode} onChange={onChange} sx={formStyles.input}>
                  {modeOptions.map(([value, label]) => (
                    <MenuItem key={value} value={value} sx={{ backgroundColor: "#333" }}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                margin="normal"
                label="Altura Máxima de Construcción"
                type="number"
                name="maxBuildHeight"
                value={formData.maxBuildHeight}
                onChange={onChange}
                sx={formStyles.input}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Distancia de Visualización"
                type="number"
                name="viewDistance"
                value={formData.viewDistance}
                onChange={onChange}
                sx={formStyles.input}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Grid container>
                {switchOptions.map(([field, label]) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <FormControlLabel
                      control={<Switch checked={formData[field]} onChange={onChange} name={field} color="success" />}
                      label={<Typography sx={formStyles.text}>{label}</Typography>}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      <Box mt={3} display="flex" gap={2} flexWrap="wrap">
        <Button
          variant="contained"
          onClick={onSubmit}
          startIcon={<Add />}
          sx={{ ...formStyles.button, ...formStyles.primaryButton }}
        >
          Guardar Servidor
        </Button>

        <Button
          variant="contained"
          startIcon={<Close />}
          onClick={onCancel}
          sx={{ ...formStyles.button, ...formStyles.dangerButton }}
        >
          Cancelar
        </Button>
      </Box>
    </Paper>
  )
}
