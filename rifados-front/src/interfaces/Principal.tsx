import { useEffect, useState } from "react";
import { ModuloGeneral } from "../store/StoreGeneral";
import NuevaRifa from "./NuevaRifa/NuevaRifa";
import Usuarios from "./Usuarios/Usuarios";
import ProductosRifados from "./ProductosRifados/ProductosRifados";
import BancosRegistrados from "./BancosRegistrados/BancosRegistrados";
import HomeSistema from "./Home/HomeSistema";
import CuentasBancarias from "./CuentasBancarias/CuentasBancarias";
import Boletos from "./Boletos/Boletos";

export default function Principal() {
  const { modulo } = ModuloGeneral();
  const [componente, setComponente] = useState<JSX.Element>(<></>);

  useEffect(() => {
    switch (modulo) {
      case "carga":
        setComponente(<></>);
        break;

      case "usuarios":
        setComponente(<Usuarios />);
        break;
      case "nuevaRifa":
        setComponente(<NuevaRifa />);
        break;

      case "productosRifados":
        setComponente(<ProductosRifados />);
        break;

      case "bancosRegistrados":
        setComponente(<BancosRegistrados />);
        break;

      case "cuentasBancarias":
        setComponente(<CuentasBancarias />);
        break;

      case "boletos":
        setComponente(<Boletos />);
        break;

      default:
        setComponente(<HomeSistema />);
        break;
    }
  }, [modulo]);

  return <div>{componente}</div>;
}
