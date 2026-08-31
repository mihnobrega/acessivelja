import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

const preferenciasSalvas =
  localStorage.getItem(
    "acessivelJaPreferencias"
  );

if (preferenciasSalvas) {
  try {
    const preferencias =
      JSON.parse(preferenciasSalvas);

    document.documentElement.classList.toggle(
      "texto-maior",
      Boolean(preferencias.textoMaior)
    );

    document.documentElement.classList.toggle(
      "alto-contraste",
      Boolean(preferencias.altoContraste)
    );
  } catch (erro) {
    console.error(
      "Erro ao carregar preferências:",
      erro
    );
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);