"use client"

import { useState, useEffect, useRef } from "react"
import "../styles/Home.css";
import HeroParallax from "../components/Home/HeroParallax";
import ServerTable from "../components/Home/ServerTable";
import FeaturesSection from "../components/Home/FeaturesSection";
import AdditionalContent from "../components/Home/AdditionalContent";
import StatsCounter from "../components/Home/StatsCounter"
import Navbar from "../components/Navbar/Navbar"
import { Helmet } from "react-helmet"
import { FaChevronDown } from "react-icons/fa"

/**
 * Componente principal de la página de inicio
 * Gestiona el estado del modo día/noche y renderiza las diferentes secciones
 */
const Home = () => {
  // Estado para controlar el modo día/noche
  const [isNightMode, setIsNightMode] = useState(false)
  const contentRef = useRef(null)

  // Efecto para aplicar una clase al body cuando cambia el modo
  useEffect(() => {
    // Añade una clase al body para posibles estilos globales según el modo
    document.body.className = isNightMode ? "night-mode" : "day-mode"

    return () => {
      // Limpieza al desmontar
      document.body.className = ""
    }
  }, [isNightMode])

  // Función para alternar entre los modos día y noche
  const toggleTheme = () => {
    setIsNightMode((prevMode) => !prevMode)
  }

  // Función para desplazarse suavemente hacia abajo
  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <Helmet>
        <title>Minecraft Servers - Automatizados e Increíbles</title>
        <meta
          name="description"
          content="Crea tu servidor de Minecraft gratis en menos de un minuto y comienza tu aventura hoy mismo."
        />
      </Helmet>

      <main className="home-container">
        {/* Título principal sobre el parallax */}
        <div className="hero-title-container">
          <div className="hero-title-content">
            <h1 className="hero-main-title">
              <span className="hero-title-line">MINECRAFT</span>
              <span className="hero-title-line">SERVERS</span>
            </h1>
            <p className="hero-subtitle">Crea tu propio mundo. Juega con tus amigos. Sin límites.</p>
            <button onClick={scrollToContent} className="scroll-down-button" aria-label="Desplazarse hacia abajo">
              <FaChevronDown />
            </button>
          </div>
        </div>

        {/* Sección Hero con efecto parallax */}
        <HeroParallax isNightMode={isNightMode} toggleTheme={toggleTheme} />

        {/* Primera sección con tabla de servidores */}
        <section ref={contentRef} className="content-section white">
          <div className="content-wrapper">
            <h2 className="minecraft-font section-title">
              Servidores de Minecraft.
              <br />
              Automatizados. Increíbles.
            </h2>
            <div className="section-spacer"></div>
            <ServerTable />
          </div>
        </section>

        {/* Sección de estadísticas con contadores */}
        <StatsCounter />

        {/* Sección de características */}
        <FeaturesSection />

        {/* Sección de contenido adicional */}
        <AdditionalContent />
      </main>
    </>
  )
}

export default Home
