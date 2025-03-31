import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, onValue, ref, set } from "firebase/database";

// 🔹 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCt9gVL6umgey2qOAsPuiHB43tC18IFHoY",
  authDomain: "alturos-65345.firebaseapp.com",
  projectId: "alturos-65345",
  storageBucket: "alturos-65345.firebasestorage.app",
  messagingSenderId: "472204709948",
  appId: "1:472204709948:web:bb63f1364cb09fb7543339",
  measurementId: "G-KTJJC0B30C"
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app); // Conexión a Realtime Database

// 🔹 Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("❌ Error en Google Sign-In:", error);
    throw error;
  }
};

// 🔹 Función para guardar los datos de una caída en Realtime Database
export const saveCaida = (caida) => {
  const caidasRef = ref(database, 'caidas/' + caida.id);  // Agregar el ID para que cada caída sea única
  set(caidasRef, caida)
    .then(() => {
      console.log("✅ Caída guardada correctamente");
    })
    .catch((error) => {
      console.error("❌ Error guardando la caída:", error);
    });
};

// 🔹 Función para obtener las caídas de Realtime Database
export const getCaidas = (callback) => {
  const caidasRef = ref(database, 'caidas');  // Ref a la ruta de caídas
  onValue(caidasRef, (snapshot) => {
    const data = snapshot.val();
    const caidasArray = [];
    for (let id in data) {
      caidasArray.push({ id, ...data[id] });
    }
    callback(caidasArray);  // Llamar al callback con los datos obtenidos
  });
};

// 🔹 Función para obtener los BPM de los dispositivos desde Realtime Database
export const getBpmData = (callback) => {
  const bpmRef = ref(database, 'dispositivo'); // Ruta de los dispositivos
  onValue(bpmRef, (snapshot) => {
    const data = snapshot.val();
    const bpmValues = Object.values(data).map(dispositivo => dispositivo.pulsoCardiaco); // Extraemos los valores de BPM
    const labels = Object.keys(data);  // Usamos los IDs de los dispositivos como etiquetas

    callback({
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
  });
};


export { auth, database, provider };

