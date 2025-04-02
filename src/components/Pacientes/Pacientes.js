import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPacientesByCuidador } from "../Login/Firebase"; // Suponiendo que tienes una función que obtiene el paciente por ID de Firestore
import "./Pacientes.css"; // Archivo de estilos

export default function Pacientes() {
  const { id } = useParams();  // Obtener el ID del paciente desde la URL
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener la información del paciente por ID
  useEffect(() => {
    setLoading(true);
    setError(null);

    getPacientesByCuidador(id)  // Consulta a Firestore para obtener los detalles del paciente
      .then((data) => {
        setPaciente(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error obteniendo los detalles del paciente:", err);
        setError("No se pudo obtener los detalles del paciente");
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="paciente-detalles-container">
      <h1>Detalles del Paciente</h1>

      {loading ? (
        <p className="loading-text">Cargando información del paciente...</p>
      ) : error ? (
        <p className="error-text">Error: {error}</p>
      ) : paciente ? (
        <div className="paciente-info">
          <div className="paciente-card">
            <h2>{paciente.nombre}</h2>
            <p><strong>ID:</strong> {paciente.id}</p>
            <p><strong>Edad:</strong> {paciente.edad}</p>
            <p><strong>Email:</strong> {paciente.email}</p>
            <p><strong>Teléfono:</strong> {paciente.telefono}</p>
          </div>

          <div className="paciente-card">
            <h3>Datos médicos</h3>
            <p><strong>Enfermedad:</strong> {paciente.enfermedad}</p>
            <p><strong>Medicamentos:</strong> {paciente.medicamentos}</p>
            <p><strong>Última consulta:</strong> {paciente.ultimaConsulta}</p>
          </div>
        </div>
      ) : (
        <p className="paciente-not-found">Paciente no encontrado</p>
      )}
    </div>
  );
}
