import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import { getDatabase, onValue, ref } from "firebase/database"; // Firebase import
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Asegúrate de importar los gráficos correctos
import { FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
  
  // Registrar todas las escalas y elementos necesarios
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  
  export default function Graficas() {
    const navigate = useNavigate();
  
    const [bpmData, setBpmData] = useState({
      labels: [],
      datasets: [
        {
          label: "BPM",
          data: [],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });
  
    // Función para obtener los BPM y otros datos de Firebase
    useEffect(() => {
      const db = getDatabase();
      const bpmRef = ref(db, "caidas");
  
      onValue(bpmRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Agrupamos los BPM por valor (cuántas veces ocurre cada BPM)
          const bpmCount = {};
          Object.values(data).forEach((dispositivo) => {
            const bpm = dispositivo.pulsoCardiaco;
            bpmCount[bpm] = (bpmCount[bpm] || 0) + 1;
          });
  
          // Creamos las etiquetas (valores de BPM) y los datos (cuántos dispositivos tienen ese BPM)
          const labels = Object.keys(bpmCount);
          const bpmValues = Object.values(bpmCount);
  
          // Actualizamos el estado para la gráfica
          setBpmData({
            labels: labels,
            datasets: [
              {
                label: "BPM",
                data: bpmValues,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          });
        }
      });
    }, []);
  
    return (
      <div className="grapContainer">
        <h1><FaChartLine /> Gráficas</h1>
        <button className="boton-volver-admin" onClick={() => navigate("/admin")}>
          Volver
        </button>
  
        <div className="grapContent">
          <div className="grapCard">
            <h3>Gráfico de BPM</h3>
            <Bar data={bpmData} />
          </div>
        </div>
      </div>
    );
  }
  