"use client"

import { useState, useEffect, useRef } from "react"
import { Modal, Box, Typography, Button, Alert, TextField, IconButton } from "@mui/material"
import { Close, Refresh, Clear, Send } from "@mui/icons-material"
import { CommandSuggestions } from "./CommandSuggestions"

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "85%", md: "75%" },
  maxWidth: 1000,
  p: 4,
  backgroundColor: "rgba(40, 40, 40, 0.95)",
  borderRadius: 0,
  border: "4px solid #4a4a4a",
  boxShadow: "0 0 0 2px #2d2d2d",
  outline: "none",
  // transform: "perspective(500px) rotateX(2deg)",
  // transition: "all 0.3s ease",
  // "&:hover": {
  //   boxShadow: "0 0 0 2px #2d2d2d",
  //   transform: "perspective(500px) rotateX(5deg)",
  // },
}

const logStyles = {
  backgroundColor: "#000",
  color: "#4CAF50",
  padding: 2,
  fontFamily: "monospace",
  whiteSpace: "pre-wrap",
  height: 400,
  overflow: "auto",
  border: "2px solid #4a4a4a",
  fontSize: "0.85rem",
  lineHeight: 1.5,
}

const buttonStyles = {
  borderRadius: 0,
  border: "2px solid #4a4a4a",
  boxShadow: "0 0 0 1px #2d2d2d",
  fontWeight: "bold",
  textTransform: "uppercase",
  m: 0.5,
}

const closeButtonStyles = {
  ...buttonStyles,
  backgroundColor: "#f44336",
  color: "white",
  "&:hover": { backgroundColor: "#d32f2f" },
}

const actionButtonStyles = {
  ...buttonStyles,
  backgroundColor: "#4CAF50",
  color: "white",
  "&:hover": { backgroundColor: "#3d8b40" },
}

export const ServerLogModal = ({
  open,
  onClose,
  serverId,
  logContent,
  isConnected,
  error,
  onReconnect,
  onClearLogs,
  onSendCommand,
}) => {
  const [command, setCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandError, setCommandError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  const logContainerRef = useRef(null)
  const commandInputRef = useRef(null)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logContent])

  // Focus command input when modal opens
  useEffect(() => {
    if (open && commandInputRef.current) {
      setTimeout(() => {
        commandInputRef.current.focus()
      }, 300)
    }
  }, [open])

  // Handle command submission
  const handleSendCommand = async () => {
    if (!command.trim() || !serverId || isProcessing) return

    setIsProcessing(true)
    setCommandError(null)

    try {
      // Send command to server
      await onSendCommand(command)

      // Add command to history
      setCommandHistory((prev) => {
        const newHistory = [...prev, command]
        // Keep only last 20 commands
        if (newHistory.length > 20) {
          return newHistory.slice(newHistory.length - 20)
        }
        return newHistory
      })

      // Reset history index
      setHistoryIndex(-1)

      // Clear command input
      setCommand("")
    } catch (err) {
      console.error("Error sending command:", err)
      setCommandError(err.message || "Error sending command")
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle key press in command input
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendCommand()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      // Navigate command history
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCommand(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      // Navigate command history
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCommand(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion for common commands
      const commonPrefixes = [
        "help",
        "list",
        "time",
        "weather",
        "gamemode",
        "difficulty",
        "op",
        "deop",
        "kick",
        "ban",
        "pardon",
        "save",
        "stop",
      ]
      const currentInput = command.toLowerCase()

      for (const prefix of commonPrefixes) {
        if (prefix.startsWith(currentInput) && prefix !== currentInput) {
          setCommand(prefix)
          return
        }
      }
    }
  }

  // Handle selecting a suggested command
  const handleSelectCommand = (selectedCommand) => {
    setCommand(selectedCommand)
    if (commandInputRef.current) {
      commandInputRef.current.focus()
    }
  }

  // Format log content with colors
  const formatLogContent = (content) => {
    if (!content) return "> Esperando datos..."

    // Replace common log patterns with colored text
    return (
      content
        .replace(/\[INFO\]/g, '<span style="color: #4CAF50;">[INFO]</span>')
        .replace(/\[WARN\]/g, '<span style="color: #FFC107;">[WARN]</span>')
        .replace(/\[ERROR\]/g, '<span style="color: #F44336;">[ERROR]</span>')
        .replace(/\[DEBUG\]/g, '<span style="color: #2196F3;">[DEBUG]</span>')
        .replace(/Done $$[^)]+$$!/g, '<span style="color: #FFC107; font-weight: bold;">$&</span>')
        .replace(
          /(Starting minecraft server version [^)]+)/g,
          '<span style="color: #2196F3; font-weight: bold;">$1</span>',
        )
        // Highlight command responses
        .replace(
          /> Command sent: ([^\n]+)/g,
          '> <span style="color: #42A5F5; font-weight: bold;">Command sent: $1</span>',
        )
        .replace(/> Response: ([\s\S]*?)(?=\n>|$)/g, '> <span style="color: #FFA726;">Response: $1</span>')
    )
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyles}>
        <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
          Terminal del Servidor #{serverId}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {commandError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {commandError}
          </Alert>
        )}

        <Box ref={logContainerRef} sx={logStyles} dangerouslySetInnerHTML={{ __html: formatLogContent(logContent) }} />

        {/* Command suggestions */}
        {showSuggestions && <CommandSuggestions onSelectCommand={handleSelectCommand} />}

        {/* Command input */}
        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Escribe un comando (ej: help, list, weather clear)"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyPress}
            inputRef={commandInputRef}
            disabled={!isConnected || isProcessing}
            sx={{
              backgroundColor: "rgba(0,0,0,0.3)",
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                borderRadius: 0,
                "& fieldset": {
                  borderColor: "#4a4a4a",
                },
                "&:hover fieldset": {
                  borderColor: "#4CAF50",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4CAF50",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleSendCommand}
                  disabled={!command.trim() || !isConnected || isProcessing}
                  sx={{
                    color: "#4CAF50",
                    "&.Mui-disabled": {
                      color: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  <Send />
                </IconButton>
              ),
            }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Box>
            {isConnected ? (
              <Typography variant="body2" sx={{ color: "#4CAF50" }}>
                ● Conectado
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ color: "#f44336" }}>
                ● Desconectado
              </Typography>
            )}
          </Box>

          <Box>
            <Button
              onClick={() => setShowSuggestions(!showSuggestions)}
              variant="outlined"
              sx={{
                ...buttonStyles,
                color: "#4CAF50",
                borderColor: "#4CAF50",
              }}
            >
              {showSuggestions ? "Ocultar sugerencias" : "Mostrar sugerencias"}
            </Button>

            <Button
              onClick={onReconnect}
              variant="contained"
              startIcon={<Refresh />}
              disabled={isConnected}
              sx={actionButtonStyles}
            >
              Reconectar
            </Button>

            <Button onClick={onClearLogs} variant="contained" startIcon={<Clear />} sx={actionButtonStyles}>
              Limpiar
            </Button>

            <Button onClick={onClose} variant="contained" startIcon={<Close />} sx={closeButtonStyles}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
