"use client"

import { useState } from "react"

export const useServerForm = () => {
  const initialFormData = {
    nombreServidor: "",
    software: "Java",
    modpack: "",
    version: "1.20.6",
    maxPlayers: 20,
    difficulty: "NORMAL",
    mode: "SURVIVAL",
    maxBuildHeight: 256,
    viewDistance: 10,
    spawnNpcs: true,
    allowNether: true,
    spawnAnimals: true,
    spawnMonsters: true,
    pvp: true,
    enableCommandBlock: false,
    allowFlight: false,
  }

  const [formData, setFormData] = useState(initialFormData)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [formError, setFormError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Special handling for software changes
    if (name === "software" && value === "Modpack") {
      // When switching to Modpack, keep other settings but clear version
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        modpack: "",
      }))
    } else if (name === "software" && formData.software === "Modpack") {
      // When switching from Modpack to something else, clear modpack URL
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        modpack: "",
      }))
    } else {
      // Normal handling for other fields
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const validateForm = () => {
    // Basic validation
    if (!formData.nombreServidor.trim()) {
      setFormError("El nombre del servidor es obligatorio")
      return false
    }

    // Validate modpack URL if software is Modpack
    if (formData.software === "Modpack") {
      if (!formData.modpack) {
        setFormError("La URL del modpack es obligatoria")
        return false
      }

      const validUrl =
        /^https?:\/\/www\.curseforge\.com\/minecraft\/modpacks\/[^/]+(\/?|\/files\/\d+\/?|\/download\/\d+\/?)?$/.test(
        formData.modpack,
      )
      if (!validUrl) {
        setFormError(
          "La URL del modpack no es válida. Debe ser una URL de CurseForge (ej: https://www.curseforge.com/minecraft/modpacks/all-the-mods-8)",
        )
        return false
      }
    }

    setFormError("")
    return true
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setShowAdvanced(false)
    setFormError("")
  }

  return {
    formData,
    showAdvanced,
    formError,
    setShowAdvanced,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
    setFormError,
  }
}
