import { Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import RideRequest from "./pages/corrida/RideRequest";
import RideOptions from "./pages/corrida/RideOptions";
import SearchingDriver from "./pages/corrida/SearchingDriver";
import DriverFound from "./pages/corrida/DriverFound";
import DriverTracking from "./pages/corrida/DriverTracking";
import RideInProgress from "./pages/corrida/RideInProgress";
import RideSummary from "./pages/corrida/RideSummary";
import AccessibleMap from "./pages/AccessibleMap";
import VehicleRental from "./pages/VehicleRental";
import VehicleDetails from "./pages/VehicleDetails";
import RentalPeriod from "./pages/RentalPeriod";
import RentalSummary from "./pages/RentalSummary";
import RentalConfirmed from "./pages/RentalConfirmed";
import Profile from "./pages/Profile";
import VoiceAssistant from "./components/VoiceAssistant";

function RotaProtegida({ children }) {
  const estaLogado =
    localStorage.getItem("acessivelJaLogado") === "true";

  if (!estaLogado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/home" element={<RotaProtegida><Home /></RotaProtegida>} />
        <Route path="/corrida" element={<RotaProtegida><RideRequest /></RotaProtegida>} />
        <Route path="/corrida/opcoes" element={<RotaProtegida><RideOptions /></RotaProtegida>} />
        <Route path="/corrida/procurando" element={<RotaProtegida><SearchingDriver /></RotaProtegida>} />
        <Route path="/corrida/motorista" element={<RotaProtegida><DriverFound /></RotaProtegida>} />
        <Route path="/corrida/acompanhamento" element={<RotaProtegida><DriverTracking /></RotaProtegida>} />
        <Route path="/corrida/em-andamento" element={<RotaProtegida><RideInProgress /></RotaProtegida>} />
        <Route path="/corrida/resumo" element={<RotaProtegida><RideSummary /></RotaProtegida>} />
        <Route path="/mapa-acessivel" element={<RotaProtegida><AccessibleMap /></RotaProtegida>} />
        <Route path="/aluguel" element={<RotaProtegida><VehicleRental /></RotaProtegida>} />
        <Route path="/aluguel/:id" element={<RotaProtegida><VehicleDetails /></RotaProtegida>} />
        <Route path="/aluguel/:id/periodo" element={<RotaProtegida><RentalPeriod /></RotaProtegida>} />
        <Route path="/aluguel/:id/resumo" element={<RotaProtegida><RentalSummary /></RotaProtegida>} />
        <Route path="/aluguel/:id/confirmado" element={<RotaProtegida><RentalConfirmed /></RotaProtegida>} />
        <Route path="/perfil" element={<RotaProtegida><Profile /></RotaProtegida>} />
      </Routes>

      <VoiceAssistant />
    </>
  );
}

export default App;