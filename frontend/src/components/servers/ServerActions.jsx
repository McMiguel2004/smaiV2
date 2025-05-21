"use client"

import { Button, Box, Grid, Tooltip, IconButton, Collapse, Zoom } from "@mui/material"
import { PlayArrow, Stop, Refresh, Terminal, Upload, DeleteForever } from "@mui/icons-material"

const serverBackgrounds = {
  Java: { borderColor: "#4CAF50", iconColor: "#4CAF50" },
  Forge: { borderColor: "#ce422b", iconColor: "#ce422b" },
  Fabric: { borderColor: "#b0d0f0", iconColor: "#b0d0f0" },
  Modpack: { borderColor: "#ffc107", iconColor: "#ffc107" },
  Spigot: { borderColor: "#ff9800", iconColor: "#ff9800" },
  Bukkit: { borderColor: "#795548", iconColor: "#795548" },
}

export const ServerActions = ({
  server,
  expanded,
  onToggleExpand,
  onStart,
  onStop,
  onRestart,
  onDelete,
  onShowLogs,
  onUploadFile,
}) => {
  const borderColor = serverBackgrounds[server.software]?.borderColor || "#4a4a4a"
  const iconColor = serverBackgrounds[server.software]?.iconColor || "#4CAF50"

  return (
    <>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="outlined"
          onClick={() => onToggleExpand(server.id)}
          sx={{
            borderRadius: 0,
            border: "2px solid",
            borderColor: borderColor,
            color: "white",
            "&:hover": {
              borderColor: iconColor,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
            transition: "all 0.2s ease",
            px: 3,
            py: 0.8,
          }}
        >
          {expanded ? "Ocultar" : "Gestionar"}
        </Button>
      </Box>

      <Collapse in={expanded} timeout={300}>
        <Box
          mt={2}
          p={1}
          sx={{
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 1,
            border: `1px solid ${borderColor}`,
            transition: "all 0.3s ease",
          }}
        >
          <Grid container spacing={1} justifyContent="center">
            {server.status === "Activo" ? (
              <>
                <Grid item>
                  <Tooltip title="Reiniciar" arrow placement="top">
                    <Zoom in={expanded} style={{ transitionDelay: "100ms" }}>
                      <IconButton
                        onClick={() => onRestart(server.id)}
                        sx={{
                          color: iconColor,
                          backgroundColor: "rgba(76, 175, 80, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(76, 175, 80, 0.2)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Refresh />
                      </IconButton>
                    </Zoom>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Parar" arrow placement="top">
                    <Zoom in={expanded} style={{ transitionDelay: "200ms" }}>
                      <IconButton
                        onClick={() => onStop(server.id)}
                        sx={{
                          color: "#f44336",
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(244, 67, 54, 0.2)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Stop />
                      </IconButton>
                    </Zoom>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Terminal" arrow placement="top">
                    <Zoom in={expanded} style={{ transitionDelay: "300ms" }}>
                      <IconButton
                        onClick={() => onShowLogs(server.id)}
                        sx={{
                          color: "#2196F3",
                          backgroundColor: "rgba(33, 150, 243, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(33, 150, 243, 0.2)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Terminal />
                      </IconButton>
                    </Zoom>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Subir mod" arrow placement="top">
                    <Zoom in={expanded} style={{ transitionDelay: "400ms" }}>
                      <IconButton
                        onClick={() => onUploadFile(server.id)}
                        sx={{
                          color: "#673AB7",
                          backgroundColor: "rgba(103, 58, 183, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(103, 58, 183, 0.2)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Upload />
                      </IconButton>
                    </Zoom>
                  </Tooltip>
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <Tooltip title="Iniciar" arrow placement="top">
                    <Zoom in={expanded} style={{ transitionDelay: "100ms" }}>
                      <IconButton
                        onClick={() => onStart(server.id)}
                        sx={{
                          color: iconColor,
                          backgroundColor: "rgba(76, 175, 80, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(76, 175, 80, 0.2)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <PlayArrow />
                      </IconButton>
                    </Zoom>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Eliminar" arrow placement="top">
                    <Zoom in={expanded} style={{ transitionDelay: "200ms" }}>
                      <IconButton
                        onClick={() => onDelete(server.id)}
                        sx={{
                          color: "#f44336",
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(244, 67, 54, 0.2)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <DeleteForever />
                      </IconButton>
                    </Zoom>
                  </Tooltip>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Collapse>
    </>
  )
}
