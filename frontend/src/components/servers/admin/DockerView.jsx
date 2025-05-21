// src/components/servers/admin/DockerView.jsx
import { useEffect, useState } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextareaAutosize,
} from "@mui/material"
import FolderIcon from "@mui/icons-material/Folder"
import DescriptionIcon from "@mui/icons-material/Description"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import { serverService } from "../../../services/serverService"

export const DockerView = ({ server }) => {
  const [currentPath, setCurrentPath] = useState("/data")
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState("")
  const [contentLoading, setContentLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    setLoading(true)
    serverService
      .listFiles(server.id, currentPath)
      .then((res) => setFiles(res.files))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [server.id, currentPath])

  const handleClickItem = ({ name, type }) => {
    if (type === "dir") {
      const next = currentPath === "/" ? `/${name}` : `${currentPath}/${name}`
      setCurrentPath(next)
    } else {
      setSelectedFile(name)
      setContentLoading(true)
      setEditing(false)
      serverService
        .getFileContent(server.id, `${currentPath}/${name}`)
        .then((res) => setFileContent(res.content))
        .catch((err) => setFileContent(`Error: ${err.message}`))
        .finally(() => setContentLoading(false))
    }
  }

  const handleSave = () => {
    setSaveLoading(true)
    setSaveError(null)
    serverService
      .updateFileContent(server.id, `${currentPath}/${selectedFile}`, fileContent)
      .then(() => setEditing(false))
      .catch((err) => setSaveError(err.message))
      .finally(() => setSaveLoading(false))
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: "#2a2a2a",
            border: "2px solid #4a4a4a",
            boxShadow: "0 0 10px #000",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              mb: 2,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              textAlign: { xs: "left", sm: "center" },
            }}
          >
            🐳 Archivos en:{" "}
            <code style={{ color: "#81C784", fontSize: "inherit" }}>
              {currentPath}
            </code>
          </Typography>

          {currentPath !== "/data" && (
            <Button
              fullWidth={!!(currentPath === "/data")}
              startIcon={<ArrowBackIosNewIcon sx={{ color: "white" }} />}
              onClick={() => {
                const parts = currentPath.split("/")
                parts.pop()
                setCurrentPath(parts.join("/") || "/data")
              }}
              sx={{
                mb: 2,
                color: "white",
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              Volver
            </Button>
          )}

          <Paper
            sx={{
              maxHeight: { xs: 200, sm: 300 },
              overflow: "auto",
              mb: 2,
              backgroundColor: "#333",
            }}
          >
            <List disablePadding>
              {files.map((item) => (
                <ListItemButton
                  key={item.name}
                  onClick={() => handleClickItem(item)}
                  sx={{
                    color: "white",
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                  }}
                >
                  {item.type === "dir" ? (
                    <FolderIcon sx={{ mr: 1, color: "#81C784" }} />
                  ) : (
                    <DescriptionIcon sx={{ mr: 1, color: "#64B5F6" }} />
                  )}
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontSize: { xs: "0.8rem", sm: "1rem" },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          <Dialog
            open={!!selectedFile}
            onClose={() => setSelectedFile(null)}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
              Contenido de: {selectedFile}
              {!contentLoading && !editing && (
                <Button sx={{ ml: 2, fontSize: { xs: "0.75rem", sm: "1rem" } }} onClick={() => setEditing(true)}>
                  Editar
                </Button>
              )}
            </DialogTitle>

            <DialogContent dividers sx={{ p: { xs: 1, sm: 2 } }}>
              {contentLoading ? (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : editing ? (
                <>
                  <TextareaAutosize
                    minRows={15}
                    style={{
                      width: "100%",
                      fontFamily: "monospace",
                      backgroundColor: "#1e1e1e",
                      color: "#d4d4d4",
                      fontSize: "0.85rem",
                    }}
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                  />
                  {saveError && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {saveError}
                    </Typography>
                  )}
                </>
              ) : (
                <Paper
                  component="pre"
                  sx={{
                    p: 2,
                    backgroundColor: "#1e1e1e",
                    color: "#d4d4d4",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    fontSize: "0.85rem",
                  }}
                >
                  {fileContent}
                </Paper>
              )}
            </DialogContent>

            <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
              {editing ? (
                <>
                  <Button onClick={() => setEditing(false)} disabled={saveLoading} sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={saveLoading} variant="contained" sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}>
                    {saveLoading ? <CircularProgress size={20} /> : "Guardar"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setSelectedFile(null)} sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}>
                  Cerrar
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  )
}
