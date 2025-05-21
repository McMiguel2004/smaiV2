import React from 'react'
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Grid,
  FormControl,
  InputLabel
} from '@mui/material'

export const ServerSettings = () => {
  const booleanKeys = [
    "acceptsTransfers",
    "allowFlight",
    "allowNether",
    "broadcastConsoleToOps",
    "broadcastRconToOps",
    "enableCommandBlock",
    "enableJmxMonitoring",
    "enableQuery",
    "enableRcon",
    "enableStatus",
    "enforceSecureProfile",
    "enforceWhitelist",
    "forceGamemode",
    "generateStructures",
    "hardcore",
    "hideOnlinePlayers",
    "logIps",
    "preventProxyConnections",
    "onlineMode",
    "pvp",
    "requireResourcePack",
    "spawnAnimals",
    "spawnMonsters",
    "spawnNpcs",
    "syncChunkWrites",
    "useNativeTransport",
    "whiteList"
  ]

  const numberKeys = [
    "entityBroadcastRangePercentage",
    "functionPermissionLevel",
    "maxChainedNeighborUpdates",
    "maxPlayers",
    "maxTickTime",
    "maxWorldSize",
    "networkCompressionThreshold",
    "opPermissionLevel",
    "playerIdleTimeout",
    "queryPort",
    "rateLimit",
    "rconPort",
    "serverPort",
    "simulationDistance",
    "spawnProtection",
    "viewDistance"
  ]

  const textKeys = [
    "generatorSettings",
    "initialDisabledPacks",
    "initialEnabledPacks",
    "levelName",
    "levelSeed",
    "motd",
    "resourcePack",
    "resourcePackId",
    "resourcePackPrompt",
    "resourcePackSha1",
    "serverIp",
    "textFilteringConfig",
    "regionFileCompression"
  ]

  const selectFields = [
    {
      name: "difficulty",
      label: "Difficulty",
      options: ["peaceful", "easy", "normal", "hard"]
    },
    {
      name: "gamemode",
      label: "Gamemode",
      options: ["survival", "creative", "adventure", "spectator"]
    },
    {
      name: "levelType",
      label: "Level Type",
      options: ["default", "flat", "largebiomes", "amplified", "buffet", "default_1_1"]
    }
  ]

  // Función para formatear etiquetas camelCase a texto legible
  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim()

  return (
    <Box
      p={3}
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 2,
        maxWidth: 1200,
        margin: 'auto',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        ⚙️ Ajustes del servidor (server.properties)
      </Typography>
      <Grid container spacing={3}>

        {/* Booleanos */}
        {booleanKeys.map(key => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <FormControlLabel
              control={<Switch defaultChecked={false} sx={{ color: '#000' }} />}
              label={formatLabel(key)}
              sx={{ color: '#000', userSelect: 'none' }}
            />
          </Grid>
        ))}

        {/* Números */}
        {numberKeys.map(key => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <TextField
              fullWidth
              type="number"
              label={formatLabel(key)}
              variant="outlined"
              InputLabelProps={{ style: { color: '#000' } }}
              inputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#999' },
                  '&.Mui-focused fieldset': { borderColor: '#000' }
                }
              }}
            />
          </Grid>
        ))}

        {/* Textos */}
        {textKeys.map(key => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <TextField
              fullWidth
              label={formatLabel(key)}
              variant="outlined"
              InputLabelProps={{ style: { color: '#000' } }}
              inputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#999' },
                  '&.Mui-focused fieldset': { borderColor: '#000' }
                }
              }}
            />
          </Grid>
        ))}

        {/* Select */}
        {selectFields.map(({ name, label, options }) => (
          <Grid item xs={12} sm={6} md={4} key={name}>
            <FormControl fullWidth sx={{ color: '#000' }}>
              <InputLabel sx={{ color: '#000' }}>{label}</InputLabel>
              <Select
                defaultValue=""
                label={label}
                sx={{
                  color: '#000',
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#999',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  }
                }}
              >
                {options.map(opt => (
                  <MenuItem key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}

        {/* Contraseña RCON */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            type="password"
            label="Rcon Password"
            variant="outlined"
            InputLabelProps={{ style: { color: '#000' } }}
            inputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ccc' },
                '&:hover fieldset': { borderColor: '#999' },
                '&.Mui-focused fieldset': { borderColor: '#000' }
              }
            }}
          />
        </Grid>

      </Grid>
    </Box>
  )
}

export default ServerSettings
