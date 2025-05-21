"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Container,
  Button,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Link,
  Tooltip,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  Collapse,
  Alert,
  Snackbar,
} from "@mui/material"
import {
  Code as CodeIcon,
  Update,
  Security,
  Speed,
  CheckCircleOutline,
  ArrowDownward,
  Computer,
  Android,
  Apple,
  Terminal,
  ContentCopy,
  Info,
  ExpandMore,
  ExpandLess,
  Download,
  Lightbulb,
  CheckCircle,
} from "@mui/icons-material"
import { styled, alpha } from "@mui/material/styles"
import { motion } from "framer-motion"
import WireguardConfigGenerator from "../components/wireguard/WireguardConfigGenerator"

// Componentes estilizados para una UI consistente
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  borderRadius: "16px",
  overflow: "hidden",
  position: "relative",
  backgroundColor: "rgba(40, 40, 40, 0.85)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "6px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
}))

const CodeBlock = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: "8px",
  fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
  position: "relative",
  overflow: "hidden",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    backgroundColor: theme.palette.primary.main,
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  fontWeight: 700,
  color: "white",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "60px",
    height: "4px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    borderRadius: "2px",
  },
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}))

const ImageContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  margin: `${theme.spacing(4)} 0`,
  "& img": {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    },
  },
}))

const TutorialTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiTab-root": {
    fontWeight: 600,
    textTransform: "none",
    fontSize: "1rem",
    minHeight: "64px",
    padding: theme.spacing(1, 3),
    transition: "all 0.2s",
    color: "white",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
  },
}))

const TutorialContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "12px",
  padding: theme.spacing(3),
  maxHeight: "700px",
  overflowY: "auto",
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: alpha(theme.palette.primary.main, 0.05),
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.primary.main, 0.2),
    borderRadius: "4px",
    "&:hover": {
      background: alpha(theme.palette.primary.main, 0.3),
    },
  },
}))

const StepCard = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  borderRadius: "12px",
  overflow: "visible",
  position: "relative",
  backgroundColor: "rgba(40, 40, 40, 0.85)",
  border: `1px solid ${theme.palette.divider}`,
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    transform: "translateY(-2px)",
  },
}))

const StepNumber = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "-16px",
  left: "16px",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: "#fff",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  zIndex: 1,
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
}))

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  borderRadius: "12px",
  overflow: "hidden",
  backgroundColor: "rgba(40, 40, 40, 0.85)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
  },
}))

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 700,
}))

const InfoChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 500,
  margin: theme.spacing(0.5),
}))

/**
 * Componente WireGuard - Guía completa sobre WireGuard VPN
 *
 * Este componente proporciona información detallada sobre WireGuard, incluyendo:
 * - Introducción a VPNs y WireGuard
 * - Características principales
 * - Guías de instalación para diferentes sistemas operativos
 * - Tutoriales paso a paso con imágenes
 *
 * @returns {JSX.Element} Componente React renderizado
 */
const Wireguard = () => {
  // Estado para la selección de pestañas de tutorial
  const [tutorialTab, setTutorialTab] = useState(0)
  // Estado para mostrar notificación de copiado
  const [copySnackbar, setCopySnackbar] = useState(false)
  // Estado para expandir/colapsar secciones
  const [expandedSections, setExpandedSections] = useState({
    intro: true,
    features: true,
    installation: true,
    configuration: true,
    tutorials: true,
    myConfig: true,
  })

  // Hook para detectar el tamaño de pantalla
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  // Manejador de cambio de pestaña
  const handleTutorialChange = (event, newValue) => {
    setTutorialTab(newValue)
  }

  // Función para copiar código al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopySnackbar(true)
  }

  // Función para alternar la expansión de secciones
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Datos de tutoriales
  const tutorials = {
    ubuntu: {
      title: "Instalación de WireGuard en Ubuntu",
      steps: [
        {
          title: "Actualizar el sistema",
          description: "Antes de instalar, actualiza la lista de paquetes y los paquetes existentes:",
          code: "sudo apt update && sudo apt upgrade -y",
        },
        {
          title: "Instalar WireGuard",
          description: "Instala el paquete de WireGuard con:",
          code: "sudo apt install wireguard -y",
        },
        {
          title: "Descargar la configuración",
          description: "Descarga el archivo de configuración proporcionado:",
          image: "/assets/images/wireguard/windows/Vpn.png",
        },
        {
          title: "Mover y proteger el archivo de configuración",
          description: "Mueve el archivo de configuración a la ubicación correcta y cambia sus permisos:",
          code: "sudo mv wireguard.conf /etc/wireguard/wg0.conf\nsudo chmod 600 /etc/wireguard/wg0.conf",
        },
        {
          title: "Activar WireGuard",
          description: "Inicia WireGuard con la configuración descargada:",
          code: "sudo wg-quick up wg0",
        },
        {
          title: "Verificar la conexión",
          description: "Asegúrate de que la VPN está funcionando correctamente:",
          code: "sudo wg",
        },
        {
          title: "Habilitar la VPN al iniciar el sistema (opcional)",
          description: "Si deseas que WireGuard se inicie automáticamente en cada arranque:",
          code: "sudo systemctl enable wg-quick@wg0",
        },
      ],
    },
    windows: {
      title: "Instalación de WireGuard en Windows",
      steps: [
        {
          title: "Descarga el instalador",
          description: "Descarga el instalador desde el sitio oficial:",
          link: {
            url: "https://www.wireguard.com/install/",
            text: "Instalar Wireguard",
          },
          image: "/assets/images/wireguard/windows/Intallation.png",
        },
        {
          title: "Ejecuta el instalador",
          description: "Ejecuta el archivo descargado y sigue los pasos del instalador.",
        },
        {
          title: "Descargar la configuración",
          description:
            "En la esquina superior derecha de la página encontrarás la opción de VPN para descargar el archivo de configuración.",
          image: "/assets/images/wireguard/windows/Vpn.png",
        },
        {
          title: "Importe la configuración",
          description: "Abre WireGuard y presiona el botón de importar para adjuntar el archivo descargado.",
          image: "/assets/images/wireguard/windows/Wireguard.png",
        },
        {
          title: "Inicie la conexión",
          description: 'Presiona el botón "Activar" para iniciar la conexión.',
          image: "/assets/images/wireguard/windows/Activar.png",
        },
        {
          title: "Configuración del Firewall",
          description:
            'Si el Firewall de Windows bloquea la conexión, abre "Firewall y protección de red" y sigue con "Configuración Avanzada". Luego, configura una nueva regla.',
          images: [
            "/assets/images/wireguard/windows/Windows.png",
            "/assets/images/wireguard/windows/Avanzada.png",
            "/assets/images/wireguard/windows/Entrada.png",
            "/assets/images/wireguard/windows/Regla.png",
          ],
        },
        {
          title: "Configuración de la regla",
          description: "Especifica los parámetros necesarios en el menú de configuración de la regla:",
          images: [
            "/assets/images/wireguard/windows/Tipo.png",
            "/assets/images/wireguard/windows/Programa.png",
            "/assets/images/wireguard/windows/Protocolo.png",
            "/assets/images/wireguard/windows/Ambito.png",
            "/assets/images/wireguard/windows/Accion.png",
            "/assets/images/wireguard/windows/Perfil.png",
            "/assets/images/wireguard/windows/Nombre.png",
            "/assets/images/wireguard/windows/Reglas.png",
          ],
          finalNote:
            "Por último, verifica que la regla esté activa en la lista. Una vez finalizado, ya puedes disfrutar de jugar en LAN con tus amigos.",
        },
      ],
    },
  }

  // Características de WireGuard
  const features = [
    {
      icon: <Speed />,
      title: "Rendimiento Superior",
      description:
        "Uso de UDP como transporte para conexiones rápidas y eficientes con mínima latencia. Hasta 4 veces más rápido que OpenVPN.",
    },
    {
      icon: <Security />,
      title: "Seguridad Moderna",
      description:
        "Criptografía de clave pública moderna donde cada equipo tiene su par de claves privada y pública, utilizando algoritmos de última generación.",
    },
    {
      icon: <Computer />,
      title: "Arquitectura Flexible",
      description:
        "Servidor con puerto UDP abierto e IP conocida, mientras que el cliente no necesita IP pública ni puerto abierto. Ideal para redes complejas.",
    },
    {
      icon: <Update />,
      title: "Simplicidad y Eficiencia",
      description:
        "Función exclusiva de mantener el túnel VPN, con configuración sencilla y código base mínimo. Menos de 4,000 líneas de código.",
    },
  ]

  // Renderizado de tutoriales
  const renderTutorialContent = (tutorialKey) => {
    const tutorial = tutorials[tutorialKey]

    return (
      <div className="tutorial">
        <SectionTitle variant="h5" gutterBottom>
          {tutorial.title}
        </SectionTitle>

        {tutorial.steps.map((step, index) => (
          <StepCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StepNumber>{index + 1}</StepNumber>
            <CardContent sx={{ pt: 3 }}>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom color="white">
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ color: "#b0b0b0" }}>
                {step.description}
              </Typography>

              {step.link && (
                <Box mt={1} mb={2}>
                  <Button
                    href={step.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    color="primary"
                    startIcon={<Download />}
                    size={isSmall ? "small" : "medium"}
                  >
                    {step.link.text}
                  </Button>
                </Box>
              )}

              {step.code && (
                <CodeBlock elevation={0}>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box display="flex" alignItems="center" width="100%">
                      <CodeIcon sx={{ mr: 1, mt: 0.5 }} color="primary" />
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          m: 0,
                          whiteSpace: "pre-wrap",
                          width: "100%",
                          fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                          fontSize: "0.9rem",
                          color: "white",
                        }}
                      >
                        {step.code}
                      </Typography>
                    </Box>
                    <Tooltip title="Copiar al portapapeles">
                      <IconButton size="small" onClick={() => copyToClipboard(step.code || "")} sx={{ ml: 1 }}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CodeBlock>
              )}

              {step.image && (
                <Box mt={2} textAlign="center">
                  <img
                    src={step.image || "/placeholder.svg"}
                    alt={`Paso ${index + 1}: ${step.title}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    loading="lazy"
                  />
                </Box>
              )}

              {step.images && (
                <Grid container spacing={2} mt={1}>
                  {step.images.map((img, imgIndex) => (
                    <Grid item xs={12} sm={6} key={imgIndex}>
                      <Box textAlign="center">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`${step.title} - Imagen ${imgIndex + 1}`}
                          style={{
                            width: "100%",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                          loading="lazy"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}

              {step.finalNote && (
                <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 2 }}>
                  <Typography variant="body2">{step.finalNote}</Typography>
                </Alert>
              )}
            </CardContent>
          </StepCard>
        ))}
      </div>
    )
  }

  // Renderizado principal del componente
  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: "64px", // Espacio para la navbar
        pb: 6,
        backgroundImage: "url(/assets/images/wireguard/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 5 }} className="wireguard-container">
        <StyledPaper>
          {/* Sección de Encabezado */}
          <Box
            sx={{
              textAlign: "center",
              mb: 5,
              position: "relative",
              overflow: "hidden",
              p: 3,
              borderRadius: 2,
              background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(
                theme.palette.primary.light,
                0.05,
              )})`,
            }}
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              gutterBottom
              fontWeight="700"
              sx={{
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
              }}
            >
              Guía Completa de WireGuard
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ maxWidth: "700px", mx: "auto", mb: 4, color: "#b0b0b0" }}
            >
              Todo lo que necesitas saber para entender, configurar e instalar WireGuard VPN en diferentes sistemas
              operativos
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1, mb: 3 }}>
              <InfoChip label="Seguridad" icon={<Security fontSize="small" />} />
              <InfoChip label="Rendimiento" icon={<Speed fontSize="small" />} />
              <InfoChip label="Multiplataforma" icon={<Computer fontSize="small" />} />
              <InfoChip label="Código Abierto" icon={<CodeIcon fontSize="small" />} />
            </Box>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <img
                src="https://elpuig.xeill.net/Members/vcarceler/articulos/introduccion-a-wireguard/2000px-logo_of_wireguard-svg.png"
                alt="WireGuard logo"
                style={{
                  maxWidth: isMobile ? "200px" : "300px",
                  height: "auto",
                  filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))",
                }}
              />
            </motion.div>
          </Box>

          {/* Sección de Mi Configuración */}
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                },
                p: 1,
              }}
              onClick={() => toggleSection("myConfig")}
            >
              <SectionTitle variant="h4" component="h2" sx={{ mb: 0 }}>
                Mi Configuración VPN
              </SectionTitle>
              {expandedSections.myConfig ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
            </Box>

            <Collapse in={expandedSections.myConfig}>
              <Box mt={3}>
                <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
                  <Typography variant="body1" fontWeight={500}>
                    Genera y descarga tu configuración personal de WireGuard para conectarte a nuestra red privada
                    virtual.
                  </Typography>
                </Alert>

                <WireguardConfigGenerator />
              </Box>
            </Collapse>
          </Box>

          {/* Sección de Introducción */}
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                },
                p: 1,
              }}
              onClick={() => toggleSection("intro")}
            >
              <SectionTitle variant="h4" component="h2" sx={{ mb: 0 }}>
                ¿Qué es una VPN?
              </SectionTitle>
              {expandedSections.intro ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
            </Box>

            <Collapse in={expandedSections.intro}>
              <Box mt={3}>
                <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
                  <Typography variant="body1" fontWeight={500}>
                    Una VPN (Virtual Private Network) permite crear conexiones seguras entre dispositivos a través de
                    Internet, como si estuvieran en la misma red local.
                  </Typography>
                </Alert>

                <Typography paragraph color="white">
                  Una{" "}
                  <Link href="https://en.wikipedia.org/wiki/Virtual_private_network" color="primary" underline="hover">
                    VPN
                  </Link>{" "}
                  (Virtual Private Network o red privada virtual) recrea mediante software y cifrado una red que no
                  existe a nivel físico pero que permite conectar de forma segura los equipos participantes.
                </Typography>

                <ImageContainer>
                  <img
                    src="https://elpuig.xeill.net/Members/vcarceler/articulos/introduccion-a-wireguard/1280px-vpn_overview-en-svg.png/@@images/2d6a706b-3787-450c-b03a-e51df2c12422.png"
                    alt="Esquema de una VPN"
                  />
                  <Typography variant="caption" display="block" mt={1} color="white">
                    Fuente Wikipedia: Esquema de una VPN.
                  </Typography>
                </ImageContainer>

                <Typography paragraph color="white">
                  El tráfico de la VPN se cifra y encapsula para transmitirse y, al llegar al destino, se descifra para
                  recomponer la información. Así, aunque ambos equipos estén conectados a la red física, se establece un
                  canal seguro y privado.
                </Typography>

                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Lightbulb color="warning" sx={{ mt: 0.5 }} />
                  <Typography variant="body2" color="white">
                    <strong>¿Sabías que?</strong> Las VPNs no solo son útiles para la privacidad, sino también para
                    acceder a recursos de red internos de forma segura, jugar con amigos en redes LAN virtuales, o
                    evitar restricciones geográficas.
                  </Typography>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Sección de Características */}
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                },
                p: 1,
              }}
              onClick={() => toggleSection("features")}
            >
              <SectionTitle variant="h4" component="h2" sx={{ mb: 0 }}>
                Características de WireGuard
              </SectionTitle>
              {expandedSections.features ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
            </Box>

            <Collapse in={expandedSections.features}>
              <Box mt={3}>
                <Typography paragraph color="white">
                  <Link href="https://www.wireguard.com/" color="primary" underline="hover">
                    WireGuard
                  </Link>{" "}
                  es una herramienta moderna para implementar VPNs, que ofrece seguridad y rendimiento superior:
                </Typography>

                <Grid container spacing={3} mt={2}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <FeatureCard variant="outlined">
                          <CardContent>
                            <Box
                              display="flex"
                              alignItems="center"
                              mb={2}
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: "2rem",
                                  color: theme.palette.primary.main,
                                },
                              }}
                            >
                              {feature.icon}
                              <Typography variant="h6" ml={1.5} color="white">
                                {feature.title}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="white">
                              {feature.description}
                            </Typography>
                          </CardContent>
                        </FeatureCard>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <CheckCircle color="success" sx={{ mt: 0.5 }} />
                  <Typography variant="body2" color="white">
                    <strong>Ventaja clave:</strong> A diferencia de otras soluciones VPN, WireGuard está diseñado para
                    ser simple y minimalista, lo que facilita las auditorías de seguridad y reduce la superficie de
                    ataque. Su código base es aproximadamente el 1% del tamaño de OpenVPN o IPsec.
                  </Typography>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Sección de Instalación */}
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                },
                p: 1,
              }}
              onClick={() => toggleSection("installation")}
            >
              <SectionTitle variant="h4" component="h2" sx={{ mb: 0 }}>
                Instalación Básica
              </SectionTitle>
              {expandedSections.installation ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
            </Box>

            <Collapse in={expandedSections.installation}>
              <Box mt={3}>
                <Typography paragraph color="white">
                  WireGuard se encuentra en los repositorios de las principales distribuciones GNU/Linux y también se
                  puede{" "}
                  <Link href="https://www.wireguard.com/install/" color="primary" underline="hover">
                    instalar en otros sistemas
                  </Link>{" "}
                  como Windows, macOS, iOS y Android.
                </Typography>

                <Grid container spacing={3} mb={3}>
                  <Grid item xs={6} sm={3}>
                    <Card
                      variant="outlined"
                      sx={{ textAlign: "center", p: 2, backgroundColor: "rgba(40, 40, 40, 0.85)" }}
                    >
                      <Terminal color="primary" sx={{ fontSize: "2.5rem", mb: 1 }} />
                      <Typography variant="subtitle2" color="white">
                        Linux
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card
                      variant="outlined"
                      sx={{ textAlign: "center", p: 2, backgroundColor: "rgba(40, 40, 40, 0.85)" }}
                    >
                      <Computer color="primary" sx={{ fontSize: "2.5rem", mb: 1 }} />
                      <Typography variant="subtitle2" color="white">
                        Windows
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card
                      variant="outlined"
                      sx={{ textAlign: "center", p: 2, backgroundColor: "rgba(40, 40, 40, 0.85)" }}
                    >
                      <Apple color="primary" sx={{ fontSize: "2.5rem", mb: 1 }} />
                      <Typography variant="subtitle2" color="white">
                        macOS
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card
                      variant="outlined"
                      sx={{ textAlign: "center", p: 2, backgroundColor: "rgba(40, 40, 40, 0.85)" }}
                    >
                      <Android color="primary" sx={{ fontSize: "2.5rem", mb: 1 }} />
                      <Typography variant="subtitle2" color="white">
                        Android
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom color="white">
                  Instalación en Linux (Debian/Ubuntu)
                </Typography>

                <CodeBlock elevation={2}>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box display="flex" alignItems="center" width="100%">
                      <CodeIcon sx={{ mr: 1, mt: 0.5 }} color="primary" />
                      <Typography variant="body1" fontFamily="monospace" sx={{ width: "100%", color: "white" }}>
                        apt install wireguard-tools
                      </Typography>
                    </Box>
                    <Tooltip title="Copiar al portapapeles">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard("apt install wireguard-tools")}
                        sx={{ ml: 1 }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CodeBlock>

                <Typography paragraph mt={2} color="white">
                  Una vez instalado, se utiliza el comando <code>wg</code> para gestionar la VPN y <code>wg-quick</code>{" "}
                  para activar/desactivar interfaces.
                </Typography>
              </Box>
            </Collapse>
          </Box>

          {/* Sección de Configuración */}
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                },
                p: 1,
              }}
              onClick={() => toggleSection("configuration")}
            >
              <SectionTitle variant="h4" component="h2" sx={{ mb: 0 }}>
                Configuración de una VPN entre dos equipos
              </SectionTitle>
              {expandedSections.configuration ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
            </Box>

            <Collapse in={expandedSections.configuration}>
              <Box mt={3}>
                <Typography paragraph color="white">
                  La configuración mínima requiere dos equipos: uno actuando como <code>servidor</code> (con IP y puerto
                  UDP abiertos) y otro como <code>cliente</code>.
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h3" fontWeight="600" gutterBottom color="white">
                    Creación de un par de claves en cada equipo
                  </Typography>

                  <Typography paragraph color="white">
                    Cada equipo utiliza dos claves (pública y privada) que se generan así:
                  </Typography>

                  <CodeBlock elevation={2}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box display="flex" alignItems="center" width="100%">
                        <CodeIcon sx={{ mr: 1, mt: 0.5 }} color="primary" />
                        <Typography variant="body1" fontFamily="monospace" sx={{ width: "100%", color: "white" }}>
                          umask 077; wg genkey | tee privatekey | wg pubkey &gt; publickey
                        </Typography>
                      </Box>
                      <Tooltip title="Copiar al portapapeles">
                        <IconButton
                          size="small"
                          onClick={() =>
                            copyToClipboard("umask 077; wg genkey | tee privatekey | wg pubkey > publickey")
                          }
                          sx={{ ml: 1 }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CodeBlock>

                  <Typography paragraph mt={2} color="white">
                    Se crean dos archivos:
                  </Typography>

                  <List>
                    <StyledListItem>
                      <ListItemIcon>
                        <CheckCircleOutline color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="white">
                            <code>privatekey</code> con la clave privada.
                          </Typography>
                        }
                      />
                    </StyledListItem>

                    <StyledListItem>
                      <ListItemIcon>
                        <CheckCircleOutline color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="white">
                            <code>publickey</code> con la clave pública.
                          </Typography>
                        }
                      />
                    </StyledListItem>
                  </List>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h3" fontWeight="600" gutterBottom color="white">
                    Configuración en el servidor
                  </Typography>

                  <Typography paragraph color="white">
                    Una vez instalado, accede al directorio <code>/etc/wireguard</code> y genera las claves. Luego edita
                    el archivo <code>/etc/wireguard/wg0.conf</code>:
                  </Typography>

                  <CodeBlock elevation={2}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box display="flex" alignItems="center" width="100%">
                        <CodeIcon sx={{ mr: 1, mt: 0.5 }} color="primary" />
                        <Typography
                          variant="body1"
                          fontFamily="monospace"
                          component="pre"
                          sx={{
                            m: 0,
                            whiteSpace: "pre-wrap",
                            width: "100%",
                            color: "white",
                          }}
                        >
                          {`[Interface]
# IP de la interfaz wg0
Address = 192.168.6.1/24

# Puerto UDP de escucha
ListenPort = 41194

# Clave privada del servidor
PrivateKey = hshshsh...

[Peer]
# Clave pública del cliente
PublicKey = adfadf...

# IP exacta del cliente
AllowedIPs = 192.168.6.2/32`}
                        </Typography>
                      </Box>
                      <Tooltip title="Copiar al portapapeles">
                        <IconButton
                          size="small"
                          onClick={() =>
                            copyToClipboard(`[Interface]
# IP de la interfaz wg0
Address = 192.168.6.1/24

# Puerto UDP de escucha
ListenPort = 41194

# Clave privada del servidor
PrivateKey = hshshsh...

[Peer]
# Clave pública del cliente
PublicKey = adfadf...

# IP exacta del cliente
AllowedIPs = 192.168.6.2/32`)
                          }
                          sx={{ ml: 1 }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CodeBlock>

                  <Typography paragraph mt={2} color="white">
                    Activa el servicio:
                  </Typography>

                  <CodeBlock elevation={2}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box display="flex" alignItems="center" width="100%">
                        <CodeIcon sx={{ mr: 1, mt: 0.5 }} color="primary" />
                        <Typography variant="body1" fontFamily="monospace" sx={{ width: "100%", color: "white" }}>
                          systemctl enable wg-quick@wg0
                        </Typography>
                      </Box>
                      <Tooltip title="Copiar al portapapeles">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard("systemctl enable wg-quick@wg0")}
                          sx={{ ml: 1 }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CodeBlock>

                  <Typography paragraph mt={2} color="white">
                    Y encéndelo:
                  </Typography>

                  <CodeBlock elevation={2}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box display="flex" alignItems="center" width="100%">
                        <CodeIcon sx={{ mr: 1, mt: 0.5 }} color="primary" />
                        <Typography variant="body1" fontFamily="monospace" sx={{ width: "100%", color: "white" }}>
                          systemctl start wg-quick@wg0
                        </Typography>
                      </Box>
                      <Tooltip title="Copiar al portapapeles">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard("systemctl start wg-quick@wg0")}
                          sx={{ ml: 1 }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CodeBlock>
                </Box>

                <Box>
                  <Typography variant="h5" component="h3" fontWeight="600" gutterBottom color="white">
                    Configuración en el cliente
                  </Typography>

                  <Typography paragraph color="white">
                    Edita el archivo <code>/etc/wireguard/wg0.conf</code>:
                  </Typography>

                  <CodeBlock elevation={2}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box display="flex" alignItems="center" width="100%">
                        <CodeIcon sx={{ mr: 1, mt: 0.5 }} color="primary" />
                        <Typography
                          variant="body1"
                          fontFamily="monospace"
                          component="pre"
                          sx={{
                            m: 0,
                            whiteSpace: "pre-wrap",
                            width: "100%",
                            color: "white",
                          }}
                        >
                          {`[Interface]
# Clave privada del cliente
PrivateKey = ZzZz...

# IP del cliente en la VPN
Address = 192.168.6.2/24

[Peer]
# Clave pública del servidor
PublicKey = XxXxX...
# Rango de IPs permitidas
AllowedIPs = 192.168.6.0/24

# IP y puerto UDP del servidor
Endpoint = 125.239.76.212:41194

# Mantener conexión (cada 30 segundos)
PersistentKeepalive = 30`}
                        </Typography>
                      </Box>
                      <Tooltip title="Copiar al portapapeles">
                        <IconButton
                          size="small"
                          onClick={() =>
                            copyToClipboard(`[Interface]
# Clave privada del cliente
PrivateKey = ZzZz...

# IP del cliente en la VPN
Address = 192.168.6.2/24

[Peer]
# Clave pública del servidor
PublicKey = XxXxX...
# Rango de IPs permitidas
AllowedIPs = 192.168.6.0/24

# IP y puerto UDP del servidor
Endpoint = 125.239.76.212:41194

# Mantener conexión (cada 30 segundos)
PersistentKeepalive = 30`)
                          }
                          sx={{ ml: 1 }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CodeBlock>

                  <Typography paragraph mt={2} color="white">
                    Finalmente, activa el servicio en el cliente con los mismos comandos que en el servidor.
                  </Typography>

                  <Alert severity="info" icon={<Info />} sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Nota importante:</strong> Asegúrate de reemplazar las claves de ejemplo con las generadas
                      en cada equipo. Nunca compartas tu clave privada.
                    </Typography>
                  </Alert>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Enlaces de interés */}
          <Box sx={{ mb: 6 }}>
            <SectionTitle variant="h5" component="h3">
              Enlaces de interés
            </SectionTitle>

            <List>
              <StyledListItem>
                <ListItemIcon>
                  <ArrowDownward color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Link
                      href="https://www.wireguard.com/"
                      color="primary"
                      underline="hover"
                      target="_blank"
                      rel="noopener"
                    >
                      Sitio oficial de WireGuard
                    </Link>
                  }
                />
              </StyledListItem>
              <StyledListItem>
                <ListItemIcon>
                  <ArrowDownward color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Link
                      href="https://www.wireguard.com/papers/wireguard.pdf"
                      color="primary"
                      underline="hover"
                      target="_blank"
                      rel="noopener"
                    >
                      Paper técnico de WireGuard
                    </Link>
                  }
                />
              </StyledListItem>
              <StyledListItem>
                <ListItemIcon>
                  <ArrowDownward color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Link
                      href="https://www.wireguard.com/install/"
                      color="primary"
                      underline="hover"
                      target="_blank"
                      rel="noopener"
                    >
                      Guías de instalación oficiales
                    </Link>
                  }
                />
              </StyledListItem>
            </List>
          </Box>

          {/* Sección de Tutoriales */}
          <Divider sx={{ my: 5 }} />

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                },
                p: 1,
              }}
              onClick={() => toggleSection("tutorials")}
            >
              <SectionTitle variant="h4" component="h2" sx={{ mb: 0 }}>
                Tutoriales de Instalación
              </SectionTitle>
              {expandedSections.tutorials ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
            </Box>

            <Collapse in={expandedSections.tutorials}>
              <Box mt={3}>
                <Box sx={{ width: "100%" }}>
                  <TutorialTabs
                    value={tutorialTab}
                    onChange={handleTutorialChange}
                    centered
                    indicatorColor="primary"
                    textColor="primary"
                    variant={isMobile ? "scrollable" : "standard"}
                    scrollButtons={isMobile ? "auto" : false}
                  >
                    <Tab icon={<Terminal />} label="Ubuntu" iconPosition="start" />
                    <Tab icon={<Computer />} label="Windows" iconPosition="start" />
                  </TutorialTabs>

                  <TutorialContainer>
                    {tutorialTab === 0 ? renderTutorialContent("ubuntu") : renderTutorialContent("windows")}
                  </TutorialContainer>
                </Box>
              </Box>
            </Collapse>
          </Box>
        </StyledPaper>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={copySnackbar}
          autoHideDuration={3000}
          onClose={() => setCopySnackbar(false)}
          message="Copiado al portapapeles"
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          action={
            <IconButton size="small" color="inherit" onClick={() => setCopySnackbar(false)}>
              <CheckCircle />
            </IconButton>
          }
        />
      </Container>
    </Box>
  )
}

export default Wireguard
