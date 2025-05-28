import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  InputLabel,
  Paper,
  Button,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Public as WorldIcon,
  Group as PlayersIcon,
  Computer as ServerIcon,
  Info as InfoIcon
} from '@mui/icons-material'

export const ServerSettings = ({ server }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
 
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' })
  const [expandedSection, setExpandedSection] = useState('world')

  // Configuración organizada por categorías
  const settingsConfig = {
    world: {
      title: 'Configuración del Mundo',
      icon: <WorldIcon />,
      color: '#4CAF50',
      fields: [
        { name: 'levelName', label: 'Nombre del Mundo', type: 'text', description: 'Nombre del mundo que aparecerá en el servidor' },
        { name: 'levelSeed', label: 'Semilla del Mundo', type: 'text', description: 'Semilla para generar el mundo (opcional)' },
        { name: 'levelType', label: 'Tipo de Mundo', type: 'select', options: ['default', 'flat', 'largebiomes', 'amplified', 'buffet'], description: 'Tipo de generación del mundo' },
        { name: 'difficulty', label: 'Dificultad', type: 'select', options: ['peaceful', 'easy', 'normal', 'hard'], description: 'Nivel de dificultad del juego' },
        { name: 'gamemode', label: 'Modo de Juego', type: 'select', options: ['survival', 'creative', 'adventure', 'spectator'], description: 'Modo de juego por defecto' },
        { name: 'hardcore', label: 'Modo Hardcore', type: 'boolean', description: 'Activa el modo hardcore (muerte permanente)' },
        { name: 'generateStructures', label: 'Generar Estructuras', type: 'boolean', description: 'Permite la generación de estructuras como aldeas' },
        { name: 'allowNether', label: 'Permitir Nether', type: 'boolean', description: 'Permite el acceso al Nether' }
      ]
    },
    players: {
      title: 'Configuración de Jugadores',
      icon: <PlayersIcon />,
      color: '#2196F3',
      fields: [
        { name: 'maxPlayers', label: 'Jugadores Máximos', type: 'number', min: 1, max: 1000, description: 'Número máximo de jugadores conectados' },
        { name: 'onlineMode', label: 'Modo Online', type: 'boolean', description: 'Verifica las cuentas de Minecraft con Mojang' },
        { name: 'whiteList', label: 'Lista Blanca', type: 'boolean', description: 'Solo permite jugadores en la lista blanca' },
        { name: 'enforceWhitelist', label: 'Forzar Lista Blanca', type: 'boolean', description: 'Expulsa jugadores no autorizados inmediatamente' },
        { name: 'pvp', label: 'PvP Activado', type: 'boolean', description: 'Permite combate entre jugadores' },
        { name: 'allowFlight', label: 'Permitir Vuelo', type: 'boolean', description: 'Permite el vuelo en modo supervivencia' },
        { name: 'spawnProtection', label: 'Protección del Spawn', type: 'number', min: 0, max: 100, description: 'Radio de protección alrededor del spawn' },
        { name: 'playerIdleTimeout', label: 'Tiempo de Inactividad', type: 'number', min: 0, description: 'Minutos antes de expulsar por inactividad (0 = desactivado)' }
      ]
    },
    server: {
      title: 'Configuración del Servidor',
      icon: <ServerIcon />,
      color: '#FF9800',
      fields: [
        { name: 'serverPort', label: 'Puerto del Servidor', type: 'number', min: 1, max: 65535, description: 'Puerto en el que escucha el servidor' },
        { name: 'serverIp', label: 'IP del Servidor', type: 'text', description: 'IP específica para el servidor (vacío = todas)' },
        { name: 'motd', label: 'Mensaje del Día', type: 'text', description: 'Mensaje que aparece en la lista de servidores' },
        { name: 'maxTickTime', label: 'Tiempo Máximo de Tick', type: 'number', min: -1, description: 'Tiempo máximo por tick en milisegundos' },
        { name: 'viewDistance', label: 'Distancia de Vista', type: 'number', min: 2, max: 32, description: 'Distancia de renderizado en chunks' },
        { name: 'simulationDistance', label: 'Distancia de Simulación', type: 'number', min: 2, max: 32, description: 'Distancia de simulación en chunks' },
        { name: 'enableQuery', label: 'Habilitar Query', type: 'boolean', description: 'Permite consultas de estado del servidor' },
        { name: 'queryPort', label: 'Puerto Query', type: 'number', min: 1, max: 65535, description: 'Puerto para las consultas de estado' }
      ]
    },
    security: {
      title: 'Seguridad y Administración',
      icon: <SecurityIcon />,
      color: '#F44336',
      fields: [
        { name: 'enableRcon', label: 'Habilitar RCON', type: 'boolean', description: 'Permite administración remota' },
        { name: 'rconPort', label: 'Puerto RCON', type: 'number', min: 1, max: 65535, description: 'Puerto para conexiones RCON' },
        { name: 'rconPassword', label: 'Contraseña RCON', type: 'password', description: 'Contraseña para acceso RCON' },
        { name: 'opPermissionLevel', label: 'Nivel de Permisos OP', type: 'number', min: 1, max: 4, description: 'Nivel de permisos para operadores' },
        { name: 'functionPermissionLevel', label: 'Permisos de Funciones', type: 'number', min: 1, max: 4, description: 'Nivel requerido para usar funciones' },
        { name: 'enableCommandBlock', label: 'Bloques de Comandos', type: 'boolean', description: 'Permite el uso de bloques de comandos' },
        { name: 'enforceSecureProfile', label: 'Perfil Seguro', type: 'boolean', description: 'Requiere perfiles seguros de Mojang' },
        { name: 'hideOnlinePlayers', label: 'Ocultar Jugadores', type: 'boolean', description: 'Oculta la lista de jugadores online' }
      ]
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  }

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Aquí iría la lógica para guardar las configuraciones
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulación
      setNotification({
        open: true,
        message: 'Configuración guardada exitosamente',
        type: 'success'
      })
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error al guardar la configuración',
        type: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({})
    setNotification({
      open: true,
      message: 'Configuración restablecida',
      type: 'info'
    })
  }

  const renderField = (field) => {
    const value = settings[field.name] || ''

    switch (field.type) {
      case 'boolean':
        return (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              sx={{
                background: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ py: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600">
                      {field.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {field.description}
                    </Typography>
                  </Box>
                  <Switch
                    checked={value || false}
                    onChange={(e) => handleSettingChange(field.name, e.target.checked)}
                    color="primary"
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )

      case 'select':
        return (
          <motion.div variants={itemVariants}>
            <FormControl fullWidth>
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={value}
                label={field.label}
                onChange={(e) => handleSettingChange(field.name, e.target.value)}
                sx={{
                  background: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: 'blur(10px)',
                }}
              >
                {field.options.map(option => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {field.description}
              </Typography>
            </FormControl>
          </motion.div>
        )

      default:
        return (
          <motion.div variants={itemVariants}>
            <TextField
              fullWidth
              label={field.label}
              type={field.type}
              value={value}
              onChange={(e) => handleSettingChange(field.name, e.target.value)}
              InputProps={{
                inputProps: {
                  min: field.min,
                  max: field.max
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: 'blur(10px)',
                }
              }}
              helperText={field.description}
            />
          </motion.div>
        )
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#1a1a1a', 0.95)} 0%, ${alpha('#2d2d2d', 0.95)} 100%)`,
          borderRadius: 3,
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            p: 3,
            color: 'white'
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <SettingsIcon fontSize="large" />
              </motion.div>
              <Box>
                <Typography variant="h5" fontWeight="700">
                  Configuración del Servidor
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {server?.name || 'Servidor Minecraft'}
                </Typography>
              </Box>
            </Box>
           
            <Box display="flex" gap={1}>
              <Tooltip title="Guardar cambios">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                      background: 'rgba(255,255,255,0.2)',
                      '&:hover': { background: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                </motion.div>
              </Tooltip>
             
              <Tooltip title="Restablecer">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IconButton
                    onClick={handleReset}
                    sx={{ color: 'white' }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </motion.div>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          {Object.entries(settingsConfig).map(([key, section]) => (
            <motion.div
              key={key}
              variants={itemVariants}
              style={{ marginBottom: 16 }}
            >
              <Accordion
                expanded={expandedSection === key}
                onChange={() => setExpandedSection(expandedSection === key ? '' : key)}
                sx={{
                  background: alpha(section.color, 0.05),
                  border: `1px solid ${alpha(section.color, 0.2)}`,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  mb: 2
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: section.color }} />}
                  sx={{
                    background: alpha(section.color, 0.1),
                    borderRadius: expandedSection === key ? '8px 8px 0 0' : '8px',
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      gap: 2
                    }
                  }}
                >
                  <Box sx={{ color: section.color }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="600" sx={{ color: section.color }}>
                    {section.title}
                  </Typography>
                  <Chip
                    label={`${section.fields.length} opciones`}
                    size="small"
                    sx={{
                      background: alpha(section.color, 0.2),
                      color: section.color,
                      ml: 'auto',
                      mr: 2
                    }}
                  />
                </AccordionSummary>
               
                <AccordionDetails sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {section.fields.map((field) => (
                      <Grid item xs={12} sm={6} md={4} key={field.name}>
                        {renderField(field)}
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert
          severity={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </motion.div>
  )
}

export default ServerSettings