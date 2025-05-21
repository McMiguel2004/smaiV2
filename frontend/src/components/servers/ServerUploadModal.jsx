import React, { useState } from 'react';
import { 
  Modal, Box, Typography, Button, Paper 
} from '@mui/material';
import { Upload } from '@mui/icons-material';

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '60%', md: '40%' },
  p: 4,
  backgroundColor: 'rgba(40, 40, 40, 0.85)',
  borderRadius: 0,
  border: '4px solid #4a4a4a',
  boxShadow: '0 0 0 2px #2d2d2d',
  outline: 'none',
  transform: "perspective(500px) rotateX(2deg)",
  // transition: "all 0.3s ease",
  // "&:hover": {
  //   boxShadow: "0 0 0 2px #2d2d2d",
  //   transform: "perspective(500px) rotateX(5deg)",
  // },
};

const uploadBoxStyles = {
  p: 2, 
  mb: 2, 
  backgroundColor: 'rgba(0,0,0,0.3)',
  borderRadius: 1,
  border: '2px dashed #4a4a4a'
};

const buttonStyles = {
  borderRadius: 0,
  border: '2px solid #4a4a4a',
  boxShadow: '0 0 0 1px #2d2d2d',
  fontWeight: 'bold',
  textTransform: 'uppercase',
};

const primaryButton = {
  ...buttonStyles,
  backgroundColor: '#4CAF50',
  color: 'white',
  '&:hover': { backgroundColor: '#3d8b40' }
};

const cancelButton = {
  ...buttonStyles,
  color: 'white',
  borderColor: '#f44336'
};

export const ServerUploadModal = ({ 
  open, 
  onClose, 
  serverId, 
  onUpload 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(serverId, selectedFile);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyles}>
        <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
          Subir Archivo al Servidor #{serverId}
        </Typography>
        
        <Box sx={uploadBoxStyles}>
          <input
            type="file"
            accept="*/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="upload-file-input"
          />
          <label htmlFor="upload-file-input">
            <Button
              variant="contained"
              component="span"
              fullWidth
              startIcon={<Upload />}
              sx={primaryButton}
            >
              Seleccionar Archivo
            </Button>
          </label>
          
          {selectedFile && (
            <Box mt={2} textAlign="center" sx={{ color: 'white' }}>
              <Typography variant="body1">
                Archivo seleccionado: <strong>{selectedFile.name}</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button
            onClick={onClose}
            sx={cancelButton}
          >
            Cancelar
          </Button>
          
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile}
            sx={primaryButton}
          >
            Subir Archivo
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};