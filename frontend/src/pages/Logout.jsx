"use client"

import { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Box, CircularProgress, Typography } from "@mui/material"
import { AuthContext } from "../context/AuthContext"

const Logout = () => {
  const navigate = useNavigate()
  const { logout, loading } = useContext(AuthContext)

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await logout()
        navigate("/login")
      } catch (error) {
        console.error("Error al cerrar sesión:", error)
        navigate("/login")
      }
    }

    logoutUser()
  }, [navigate, logout])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 64px)",
        mt: "64px",
      }}
    >
      <CircularProgress color="primary" size={60} />
      <Typography variant="h6" sx={{ mt: 3, color: "white" }}>
        Cerrando sesión...
      </Typography>
    </Box>
  )
}

export default Logout
