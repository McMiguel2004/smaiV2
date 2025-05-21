import { Link } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa"
import "../../styles/Home.css"

/**
 * Componente AdditionalContent - Sección final de la página con contenido adicional
 * y llamada a la acción
 */
const AdditionalContent = () => {
  const contentCards = [
    {
      title: "Crea tu propio mundo",
      description:
        "Con nuestros servidores de Minecraft, puedes crear el mundo que siempre has imaginado. Invita a tus amigos, construye estructuras impresionantes y vive aventuras únicas.",
    },
    {
      title: "Comunidad activa",
      description:
        "Únete a nuestra comunidad de jugadores y comparte tus creaciones, estrategias y experiencias. Aprende de otros y muestra tu talento en el universo de Minecraft.",
    },
    {
      title: "Soporte técnico",
      description:
        "Nuestro equipo está disponible para ayudarte con cualquier duda o problema que puedas tener. Garantizamos un servicio estable y de calidad para todos nuestros usuarios.",
    },
  ]

  return (
    <section className="content-section white additional-content">
      <div className="content-wrapper">
        <h2 className="section-title">Tu aventura comienza aquí</h2>

        <div className="content-grid">
          {contentCards.map((card, index) => (
            <div key={index} className="content-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>

        <div className="cta-container">
          <h3>¿Listo para comenzar?</h3>
          <p>Crea tu servidor de Minecraft gratis en menos de un minuto y comienza tu aventura hoy mismo.</p>
          <Link to="/register" className="cta-button">
            Crear mi servidor <FaArrowRight className="icon-right" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AdditionalContent
