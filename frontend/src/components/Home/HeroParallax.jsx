"use client"

import { useEffect, useRef, useState } from "react"
import { FaSun, FaMoon } from "react-icons/fa"
import PropTypes from "prop-types"
import "../../styles/Home.css"

/**
 * Componente HeroParallax - Sección principal con efecto parallax y cambio día/noche
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isNightMode - Estado que indica si es modo noche
 * @param {function} props.toggleTheme - Función para alternar entre modos día y noche
 */
const HeroParallax = ({ isNightMode, toggleTheme }) => {
  // Referencia al elemento contenedor para aplicar el efecto parallax
  const parallaxRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Efecto para manejar el scroll y aplicar parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return

      const scrollY = window.scrollY
      const layers = parallaxRef.current.querySelectorAll("[data-speed]")

      // Aplicar efecto parallax a cada capa
      layers.forEach((layer) => {
        const speed = Number.parseFloat(layer.getAttribute("data-speed") || 0.5)
        const yPos = -(scrollY * speed)
        layer.style.transform = `translateY(${yPos}px)`
      })
    }

    // Añadir el evento de scroll
    window.addEventListener("scroll", handleScroll)

    // Marcar como cargado después de un breve retraso para permitir que las imágenes se carguen
    const timer = setTimeout(() => setIsLoaded(true), 500)

    return () => {
      // Limpiar evento al desmontar
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  // Funciones para obtener las rutas de las imágenes según el modo
  const getImagePath = (imageName) => `/assets/images/home/${isNightMode ? "night" : "day"}/${imageName}`
  const getCherryBlossomPath = (type) =>
    `/assets/images/home/${isNightMode ? "night" : "day"}/cherryBlossomPetals_${type}.png`

  return (
    <section className="parallax-section">
      <div
        ref={parallaxRef}
        className={`MC_Hero_ParallaxC ${isNightMode ? "MC_Hero_ParallaxC__night" : "MC_Hero_ParallaxC__day"} ${isLoaded ? "loaded" : "loading"}`}
        aria-label="Escena de Minecraft con efecto parallax"
      >
        {/* Botón para cambiar entre modos día/noche */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-button"
          aria-label={isNightMode ? "Cambiar a modo día" : "Cambiar a modo noche"}
        >
          {isNightMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="MC_Hero_ParallaxC_Layers">
          {/* Capa del cielo */}
          <div className="MC_Hero_ParallaxC_Layers_sky">
            <div className="MC_Hero_ParallaxC_Layers_sky_background" data-speed="0.1">
              <img
                className="MC_Hero_ParallaxC_img"
                src={getImagePath(isNightMode ? "Sky_Night.png" : "Sky_Sun.png")}
                alt={isNightMode ? "Cielo nocturno" : "Cielo diurno"}
                loading="eager"
              />
            </div>
            <div className="MC_Hero_ParallaxC_Layers_sky_details" data-speed="0.2">
              <img
                className="MC_Hero_ParallaxC_img"
                src={getImagePath(isNightMode ? "Clouds_Night.png" : "Clouds.png")}
                alt={isNightMode ? "Nubes de noche" : "Nubes de día"}
                loading="eager"
              />
            </div>
          </div>

          {/* Capa de fondo */}
          <div className="MC_Hero_ParallaxC_Layers_background">
            <div className="MC_Hero_ParallaxC_Layers_background_main" data-speed="0.3">
              <img
                className="MC_Hero_ParallaxC_img"
                src={getImagePath(isNightMode ? "BG_Near_Night.png" : "BG_Near.png")}
                alt={isNightMode ? "Fondo cercano de noche" : "Fondo cercano de día"}
                loading="eager"
              />
            </div>
          </div>

          {/* Capa de enfoque */}
          <div className="MC_Hero_ParallaxC_Layers_focus">
            <div className="MC_Hero_ParallaxC_Layers_focus_main" data-speed="0.4">
              <img
                className="MC_Hero_ParallaxC_img"
                src={getImagePath(isNightMode ? "Focus_Cherry_Night.png" : "Focus_Cherry.png")}
                alt={isNightMode ? "Enfoque de cerezo de noche" : "Enfoque de cerezo de día"}
                loading="eager"
              />
              {/* Grupo de animaciones */}
              <div className="MC_Animations_group">
                {/* Animación de cascada */}
                <div
                  className="MC_Animations_Layer MC_Animations_Waterfall MC_Animations__play"
                  style={{
                    "--animation-delay": "0s",
                  }}
                ></div>

                {/* Animaciones de pétalos de cerezo */}
                <div
                  className="MC_Animations_Layer MC_Animations_CherryBlossomPetals_3 MC_Animations_CherryBlossomPetals MC_Animations_CherryBlossomPetals__back MC_Animations__play"
                  style={{
                    "--animation-delay": "0s",
                  }}
                ></div>

                <div
                  className="MC_Animations_Layer MC_Animations_CherryBlossomPetals_2 MC_Animations_CherryBlossomPetals MC_Animations_CherryBlossomPetals__front MC_Animations__play"
                  style={{
                    "--animation-delay": "-3s",
                  }}
                ></div>

                <div
                  className="MC_Animations_Layer MC_Animations_CherryBlossomPetals_1 MC_Animations_CherryBlossomPetals MC_Animations_CherryBlossomPetals__front MC_Animations__play"
                  style={{
                    "--animation-delay": "0s",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Capa de primer plano */}
          <div className="MC_Hero_ParallaxC_Layers_foreground">
            <div className="MC_Hero_ParallaxC_Layers_foreground_main" data-speed="0.5">
              <img
                className="MC_Hero_ParallaxC_img"
                src={getImagePath(isNightMode ? "Foreground_Night.png" : "Foreground.png")}
                alt={isNightMode ? "Primer plano de noche" : "Primer plano de día"}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Validación de tipos con PropTypes
HeroParallax.propTypes = {
  isNightMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
}

export default HeroParallax
