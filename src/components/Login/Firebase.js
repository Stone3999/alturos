// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

export { auth, provider };
