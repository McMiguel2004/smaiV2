import { Link } from "react-router-dom"
import { FaServer, FaUser, FaShoppingCart, FaThumbsUp, FaTv, FaHandPointer, FaGamepad, FaCubes } from "react-icons/fa"
import "../../styles/Home.css"

/**
 * Componente ServerTable - Muestra las características principales del servicio en formato de tabla
 * Alterna entre filas con el icono a la izquierda y a la derecha
 */
const ServerTable = () => {
  // Estructura de datos para las filas de la tabla
  const tableRows = [
    {
      icon: <FaServer size={40} />,
      title: "Tu servidor de Minecraft personal",
      description: "Tenemos una base de datos segura para mantener seguro sus datos",
      buttonText: "Consigue el tuyo ahora",
      buttonIcon: <FaUser />,
      alignment: "left",
    },
    {
      icon: <FaThumbsUp size={40} />,
      title: "Gratis",
      description:
        "Nuestro servicio es gratis, y siempre lo será para todos. No hay posibilidad de que pagues por nada.",
      buttonText: "No pagar nada ahora",
      buttonIcon: <FaShoppingCart />,
      alignment: "right",
    },
    {
      icon: <FaTv size={40} />,
      title: "Fácil de usar",
      description:
        "Fácil de usar. No sabemos por qué sería complicado tener un servidor en Minecraft, si en Smai es tan fácil como pulsar un botón.",
      buttonText: "Presione un botón ahora",
      buttonIcon: <FaHandPointer />,
      alignment: "left",
    },
    {
      icon: <FaCubes size={40} />,
      title: "Hecho para ser jugado",
      description:
        "Le ofrecemos servidores, donde puede jugar y divertirse. Mucha diversión. Sin restricciones innecesarias para robar tiempo y dinero.",
      buttonText: "Jugar ahora",
      buttonIcon: <FaGamepad />,
      alignment: "right",
    },
  ]

  return (
    <div className="server-table-container">
      {tableRows.map((row, index) => (
        <div className={`server-feature-row ${row.alignment === "right" ? "reverse" : ""}`} key={index}>
          <div className="server-feature-icon">{row.icon}</div>
          <div className="server-feature-content">
            <h2 className="feature-title">{row.title}</h2>
            <p className="feature-description">{row.description}</p>
            <Link to="/servers" className="feature-button">
              {row.buttonIcon} <span>{row.buttonText}</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ServerTable
