import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./components/Home/Home";
import Rifas from "./interfaces/Rifas";
import MetodosPago from "./interfaces/MetodosPago";
import Login from "./interfaces/Login/Login";
import Panel from "./interfaces/Panel/Panel";
import Inautorizado from "./interfaces/Errors/Inautorizado";

const Router = () => {
  return (
    <Routes>
      {/* Usa Index como un layout para tus rutas */}
      <Route path="/" element={<Layout />}>
        {/* Esta es la ruta por defecto ("/") */}
        <Route index element={<Home />} />
        <Route path="rifas" element={<Rifas />} />
        <Route path="metodosPago" element={<MetodosPago />} />
      </Route>
      <Route path="/adms" element={<Login />} />
      <Route path="/panel" element={<Panel />} />
      <Route path="/inautorizado" element={<Inautorizado />} />
    </Routes>
  );
};

export default Router;
