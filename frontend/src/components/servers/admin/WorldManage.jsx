// src/components/servers/admin/WorldManage.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Input,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { serverService } from "../../../services/serverService";

export const WorldManage = ({ server }) => {
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await serverService.importWorld(server.id, file);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      const blob = await serverService.exportWorld(server.id);
      const gzBlob =
        blob.type === "application/gzip"
          ? blob
          : new Blob([blob], { type: "application/gzip" });
      const url = window.URL.createObjectURL(gzBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${server.name}-world.tar.gz`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres borrar el World?")) return;
    setDeleting(true);
    setError(null);
    try {
      await serverService.deleteWorld(server.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: { xs: "center", sm: "left" } }}
      >
        🌍 Gestión de Worlds
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 1 }}      // menos separación en desktop
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Box
          component="label"
          htmlFor="import-world"
          sx={{ width: { xs: "100%", sm: "auto" } }} // fullWidth solo en móvil
        >
          <Input
            accept=".zip,.tar.gz,.tgz"
            id="import-world"
            type="file"
            sx={{ display: "none" }}
            onChange={handleImport}
          />
          <Button
            component="span"
            startIcon={<UploadFileIcon />}
            variant="contained"
            disabled={uploading}
            fullWidth={isXs}
          >
            {uploading ? <CircularProgress size={20} /> : "Importar TAR.GZ"}
          </Button>
        </Box>

        <Button
          startIcon={<DownloadIcon />}
          variant="contained"
          onClick={handleExport}
          disabled={exporting}
          fullWidth={isXs}
        >
          {exporting ? <CircularProgress size={20} /> : "Descargar TAR.GZ"}
        </Button>

        <Button
          startIcon={<DeleteIcon />}
          color="error"
          variant="outlined"
          onClick={handleDelete}
          disabled={deleting}
          fullWidth={isXs}
        >
          {deleting ? <CircularProgress size={20} /> : "Eliminar World"}
        </Button>
      </Stack>

      {error && (
        <Typography
          color="error"
          variant="body2"
          sx={{ textAlign: "center" }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};
