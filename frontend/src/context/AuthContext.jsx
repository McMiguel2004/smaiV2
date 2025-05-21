"use client"

import { createContext, useState, useEffect } from "react"

// Crear el contexto de autenticación
export const AuthContext = createContext()

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar el estado de autenticación al cargar la aplicación
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Función para verificar el estado de autenticación
  const checkAuthStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error("Error al verificar autenticación:", err)
      setUser(null)
      setIsAuthenticated(false)
      setError("Error al verificar la autenticación")
    } finally {
      setLoading(false)
    }
  }

  // Función para iniciar sesión
  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión")
      }

      setUser(data.user)
      setIsAuthenticated(true)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Función para registrar un nuevo usuario
  const register = async (username, email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario")
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Función para cerrar sesión
  const logout = async () => {
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al cerrar sesión")
      }

      setUser(null)
      setIsAuthenticated(false)
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
      // Cerrar sesión localmente incluso si hay un error en el servidor
      setUser(null)
      setIsAuthenticated(false)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Valores proporcionados por el contexto
  const contextValue = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
