"use client"

import { useState, useContext } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { Box, Typography, Alert, Link, Paper, Container, TextField, Button, CircularProgress } from "@mui/material"
import { Lock } from "@mui/icons-material"
import { AuthContext } from "../context/AuthContext"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login, loading } = useContext(AuthContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)
      navigate("/servers")
    } catch (err) {
      setError(err.message || "Error al iniciar sesión")
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url(/assets/images/auth/MSA_Stage5_Login.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(40, 40, 40, 0.85)",
            border: "4px solid #4a4a4a",
            boxShadow: "0 0 0 2px #2d2d2d",
            backdropFilter: "blur(5px)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Lock sx={{ fontSize: 40, mb: 2, color: "#4CAF50" }} />
            <Typography variant="h5" sx={{ mb: 3, color: "white" }}>
              INICIAR SESIÓN
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              margin="normal"
              variant="outlined"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderRadius: 0,
                "& .MuiOutlinedInput-root": {
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
                "& .MuiInputLabel-root": {
                  color: "#aaa",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              margin="normal"
              variant="outlined"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderRadius: 0,
                "& .MuiOutlinedInput-root": {
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
                "& .MuiInputLabel-root": {
                  color: "#aaa",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 0,
                backgroundColor: "#4CAF50",
                color: "white",
                fontFamily: '"Minecraft-Seven", sans-serif',
                fontSize: "1rem",
                letterSpacing: "1px",
                border: "2px solid #2E7D32",
                boxShadow: "3px 3px 0px #2E7D32",
                "&:hover": {
                  backgroundColor: "#388E3C",
                  transform: "translate(1px, 1px)",
                  boxShadow: "2px 2px 0px #2E7D32",
                },
                transition: "all 0.1s ease",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "INICIAR SESIÓN"}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="white">
              ¿No tienes cuenta?{" "}
              <Link component={RouterLink} to="/register" sx={{ color: "#4CAF50", textDecoration: "none" }}>
                Regístrate aquí
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
