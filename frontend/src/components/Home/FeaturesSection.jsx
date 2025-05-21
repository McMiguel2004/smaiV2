import { FaCogs, FaPuzzlePiece, FaShieldAlt, FaDatabase, FaGlobeAmericas, FaLifeRing } from "react-icons/fa"
import "../../styles/Home.css"

/**
 * Componente FeaturesSection - Muestra las características principales del servicio
 * con iconos y descripciones organizadas en una cuadrícula
 */
const FeaturesSection = () => {
  // Estructura de datos para las características
  const features = [
    {
      icon: <FaCogs className="feature-icon" />,
      title: "Completamente personalizable",
      description: "Ajuste todo en su servidor de su manera preferida.",
    },
    {
      icon: <FaPuzzlePiece className="feature-icon" />,
      title: "Mods y plugins",
      description:
        "¿Vanilla te aburre mucho? Añade plugins, juega con tus mods favoritos o usa uno de muchos paquetes de mods preconfigurados para tu propia experiencia.",
    },
    {
      icon: <FaShieldAlt className="feature-icon" />,
      title: "Protegido contra DDOS",
      description:
        "Tu servidor de Minecraft está completamente protegido de forma gratuita para mantenerse a salvo de los ataques DDOS.",
    },
    {
      icon: <FaDatabase className="feature-icon" />,
      title: "Copias de seguridad automáticas",
      description: "Podemos guardar un respaldo de tu servidor en tu Google Drive, en caso de que lo necesites.",
    },
    {
      icon: <FaGlobeAmericas className="feature-icon" />,
      title: "Mundos personalizados",
      description:
        "Mapas de aventura, parkour o el último minijuego. Usted puede cargar cualquier mundo que desea usar.",
    },
    {
      icon: <FaLifeRing className="feature-icon" />,
      title: "Excelente Soporte",
      description: "Si usted necesita ayuda, estamos aquí para ayudar.",
    },
  ]

  return (
    <section className="content-section black features-section">
      <div className="content-wrapper">
        <h2 className="section-title">Características principales</h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
