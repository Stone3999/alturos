import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"; // Importa getDocs en lugar de get

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
const firestore = getFirestore(app); // Conexión a Firestore

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

// 🔹 Función para agregar un nuevo paciente (usuario) en Firestore
export const addPaciente = async (paciente) => {
  try {
    const pacienteRef = doc(firestore, "pacientes", paciente.id);  // Crear documento con el ID del paciente
    await setDoc(pacienteRef, paciente);  // Guardar los datos del paciente en Firestore
    console.log("✅ Paciente agregado correctamente en Firestore.");
  } catch (error) {
    console.error("❌ Error agregando paciente en Firestore: ", error);
  }
};

// 🔹 Función para obtener los pacientes asociados a un cuidador en Firestore
export const getPacientesByCuidador = async (cuidadorId) => {
  try {
    const pacientesRef = collection(firestore, "pacientes");  // Colección de pacientes
    const q = query(pacientesRef, where("cuidadorId", "==", cuidadorId));  // Filtrar por ID del cuidador
    const querySnapshot = await getDocs(q);  // Usa getDocs para obtener una colección de documentos
    const pacientes = [];

    querySnapshot.forEach((doc) => {
      pacientes.push(doc.data());  // Agregar los pacientes al array
    });

    return pacientes;
  } catch (error) {
    console.error("❌ Error obteniendo pacientes: ", error);
  }
};

export { auth, database, firestore, provider };

