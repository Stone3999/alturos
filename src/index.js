import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppWrapper from "./App"; // Cambiado para usar el Router
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

// Si quieres medir rendimiento en tu app, usa reportWebVitals(console.log)
reportWebVitals();
