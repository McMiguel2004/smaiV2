"use client"

import { useEffect, useState, useRef } from "react"
import CountUp from "react-countup"
import { FaServer, FaUsers, FaGamepad, FaGlobe } from "react-icons/fa"

/**
 * Componente StatsCounter - Muestra estadísticas con contadores animados
 * Utiliza react-countup para animar los números
 */
const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  // Estadísticas a mostrar
  const stats = [
    {
      icon: <FaServer />,
      value: 10000,
      label: "Servidores Creados",
      suffix: "+",
      duration: 2.5,
    },
    {
      icon: <FaUsers />,
      value: 50000,
      label: "Usuarios Activos",
      suffix: "+",
      duration: 3,
    },
    {
      icon: <FaGamepad />,
      value: 99.9,
      label: "Disponibilidad",
      suffix: "%",
      duration: 2,
      decimals: 1,
    },
    {
      icon: <FaGlobe />,
      value: 150,
      label: "Países",
      suffix: "+",
      duration: 2.5,
    },
  ]

  // Efecto para detectar cuando la sección es visible en la pantalla
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }, // Trigger when 10% of the element is visible
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="content-section black stats-section">
      <div className="content-wrapper">
        <h2 className="section-title">Nuestros Números</h2>

        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">
                {isVisible ? (
                  <CountUp
                    end={stat.value}
                    duration={stat.duration}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                    useEasing={true}
                  />
                ) : (
                  "0"
                )}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsCounter
