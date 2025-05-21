"use client"

import { useState, useEffect, useRef } from "react"
import { serverService } from "../services/serverService"

export const useServerLogs = () => {
  const [logContent, setLogContent] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const eventSourceRef = useRef(null)
  const currentServerIdRef = useRef(null)

  // Function to connect to the log stream
  const connectToLogs = (serverId) => {
    if (!serverId) return

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    currentServerIdRef.current = serverId
    setLogContent("") // Clear previous logs
    setError(null)

    try {
      console.log(`Connecting to logs for server #${serverId}...`)

      // Create new EventSource connection with credentials
      const es = new EventSource(`http://localhost:5000/api/servers/server_terminal/${serverId}`, {
        withCredentials: true,
      })

      eventSourceRef.current = es

      // Set up event handlers
      es.onopen = () => {
        console.log(`Connected to server #${serverId} logs`)
        setIsConnected(true)
        setError(null)
      }

      es.onmessage = (e) => {
        console.log("Received log message:", e.data)
        setLogContent((prev) => {
          return prev ? `${prev}\n${e.data}` : e.data
        })
      }

      es.onerror = (err) => {
        console.error("EventSource error:", err)
        setError("Error connecting to server logs. Please try again.")
        setIsConnected(false)
        es.close()
        eventSourceRef.current = null
      }
    } catch (err) {
      console.error("Failed to create EventSource:", err)
      setError(`Failed to connect: ${err.message}`)
      setIsConnected(false)
    }
  }

  // Function to disconnect from the log stream
  const disconnectFromLogs = () => {
    if (eventSourceRef.current) {
      console.log("Disconnecting from server logs...")
      eventSourceRef.current.close()
      eventSourceRef.current = null
      currentServerIdRef.current = null
      setIsConnected(false)
    }
  }

  // Function to send a command to the server
  const sendCommand = async (command) => {
    if (!currentServerIdRef.current || !command.trim()) {
      return { success: false, message: "No server connected or empty command" }
    }

    try {
      const result = await serverService.sendCommand(currentServerIdRef.current, command)

      // Add command and response to logs
      setLogContent((prev) => {
        return `${prev}\n> Command sent: ${command}\n> Response: ${result.response || "Command executed successfully"}`
      })

      return { success: true, response: result.response }
    } catch (err) {
      console.error("Error sending command:", err)
      setError(`Command error: ${err.message}`)
      return { success: false, message: err.message }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectFromLogs()
    }
  }, [])

  // Function to clear logs
  const clearLogs = () => {
    setLogContent("")
  }

  return {
    logContent,
    isConnected,
    error,
    clearLogs,
    connectToLogs,
    disconnectFromLogs,
    sendCommand,
    currentServerId: currentServerIdRef.current,
  }
}
