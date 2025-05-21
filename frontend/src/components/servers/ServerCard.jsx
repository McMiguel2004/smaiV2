"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  Avatar,
  Chip,
  Grow,
  IconButton,
} from "@mui/material"
import { Settings } from "@mui/icons-material"
import { ServerStatus } from "./ServerStatus"
import { ServerActions } from "./ServerActions"
import { ServerStartupMonitor } from "./ServerStartupMonitor"

const serverBackgrounds = {
  Java: {
    backgroundImage: "url(/assets/images/servers/Grass_Block.webp)",
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderColor: "#4CAF50",
    iconColor: "#4CAF50",
  },
  Forge: {
    backgroundImage: "url(/assets/images/servers/Lit_Furnace.webp)",
    backgroundColor: "rgba(206, 66, 43, 0.2)",
    borderColor: "#ce422b",
    iconColor: "#ce422b",
  },
  Fabric: {
    backgroundImage: "url(/assets/images/servers/Loom.webp)",
    backgroundColor: "rgba(176, 208, 240, 0.2)",
    borderColor: "#b0d0f0",
    iconColor: "#b0d0f0",
  },
  Modpack: {
    backgroundImage: "url(/assets/images/servers/Bookshelf.webp)",
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    borderColor: "#ffc107",
    iconColor: "#ffc107",
  },
  Spigot: {
    backgroundImage: "url(/assets/images/servers/Command_Block.webp)",
    backgroundColor: "rgba(255, 152, 0, 0.2)",
    borderColor: "#ff9800",
    iconColor: "#ff9800",
  },
  Bukkit: {
    backgroundImage: "url(/assets/images/servers/Crafting_Table.webp)",
    backgroundColor: "rgba(121, 85, 72, 0.2)",
    borderColor: "#795548",
    iconColor: "#795548",
  },
}

const getServerCardStyle = (software) => {
  const defaultStyle = {
    backgroundColor: "rgba(60, 60, 60, 0.7)",
    borderRadius: 0,
    border: "3px solid #4a4a4a",
    boxShadow: "0 0 0 1px #2d2d2d",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
    },
  }

  if (!serverBackgrounds[software]) return defaultStyle

  return {
    ...defaultStyle,
    backgroundColor: serverBackgrounds[software].backgroundColor,
    borderColor: serverBackgrounds[software].borderColor,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: serverBackgrounds[software].backgroundImage,
      backgroundSize: "150px 150px",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      opacity: 0.25,
      zIndex: 0,
    },
  }
}

const getSoftwareIcon = (software) => {
  const bgColor = serverBackgrounds[software]?.iconColor || "#888888"
  return {
    fontSize: 40,
    mr: 2,
    color: bgColor,
  }
}

export const ServerCard = ({
  server,
  expanded,
  onToggleExpand,
  onStart,
  onStop,
  onRestart,
  onDelete,
  onShowLogs,
  onUploadFile,
  onServerReady,
}) => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleAdminClick = () => {
    navigate(`/server/${server.name}`, { state: { server } })
  }

  const cardStyle = getServerCardStyle(server.software)
  const iconStyle = getSoftwareIcon(server.software)
  const titleColor = serverBackgrounds[server.software]?.iconColor || "#4CAF50"

  const getModpackName = () => {
    if (!server.curseforge_modpack_url) return null
    try {
      const url = new URL(server.curseforge_modpack_url)
      const pathParts = url.pathname.split("/")
      const modpackIndex = pathParts.indexOf("modpacks")
      if (modpackIndex !== -1 && pathParts.length > modpackIndex + 1) {
        return pathParts[modpackIndex + 1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())
      }
      return "Modpack personalizado"
    } catch (e) {
      return "Modpack personalizado"
    }
  }

  const modpackName = server.software === "Modpack" ? getModpackName() : null

  return (
    <Grow in={isVisible} timeout={500}>
      <Card sx={cardStyle}>
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={iconStyle}>{server.software.charAt(0)}</Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: titleColor,
                  fontWeight: "bold",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                }}
              >
                {server.name}
              </Typography>
              <ServerStatus status={server.status} />
            </Box>
            <IconButton onClick={handleAdminClick} sx={{ color: "white", ml: "auto" }}>
              <Settings />
            </IconButton>
          </Box>

          <Divider
            sx={{
              mb: 2,
              backgroundColor: serverBackgrounds[server.software]?.borderColor || "#4a4a4a",
              opacity: 0.7,
            }}
          />

          <ServerStartupMonitor server={server} onReady={onServerReady} />

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Software:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: serverBackgrounds[server.software]?.iconColor || "white",
                }}
              >
                {server.software}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Versión:
              </Typography>
              <Typography variant="body1" sx={{ color: "white" }}>
                {server.version}
              </Typography>
            </Grid>

            {modpackName && (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: "#aaa" }}>
                  Modpack:
                </Typography>
                <Chip
                  label={modpackName}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 193, 7, 0.2)",
                    color: "#ffc107",
                    border: "1px solid #ffc107",
                    mt: 0.5,
                  }}
                />
              </Grid>
            )}

            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                IP:
              </Typography>
              <Typography variant="body1" sx={{ color: "white" }}>
                {server.ip_address || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Puerto:
              </Typography>
              <Typography variant="body1" sx={{ color: "white" }}>
                {server.port || "N/A"}
              </Typography>
            </Grid>
          </Grid>

          <ServerActions
            server={server}
            expanded={expanded}
            onToggleExpand={onToggleExpand}
            onStart={onStart}
            onStop={onStop}
            onRestart={onRestart}
            onDelete={onDelete}
            onShowLogs={onShowLogs}
            onUploadFile={onUploadFile}
          />
        </CardContent>
      </Card>
    </Grow>
  )
}
