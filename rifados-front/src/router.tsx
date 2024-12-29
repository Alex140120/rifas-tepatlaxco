import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./components/Home/Home";
import Rifas from "./interfaces/Rifas";
import MetodosPago from "./interfaces/MetodosPago";

const Router = () => {
  return (
    <Routes>
      {/* Usa Index como un layout para tus rutas */}
      <Route path="/" element={<Layout />}>
      {/* Esta es la ruta por defecto ("/") */}
        <Route index element={<Home />} />
        <Route path="rifas" element={<Rifas/>}/>
        <Route path="metodosPago" element={<MetodosPago/>}/>
      </Route>
    </Routes>
  );
};

export default Router;
