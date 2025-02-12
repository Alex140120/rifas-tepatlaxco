import instance from "../api/axios";
import { useEffect, useState } from "react";
import { CuentasBancariasI } from "../constants/Interfaces-ts";

export default function MetodosPago() {
  const [cuentasBancarias, setCuentasBancarias] = useState<CuentasBancariasI[]>(
    []
  );

  useEffect(() => {
    cuentasBancariasFunction();
  }, []);

  const cuentasBancariasFunction = () => {
    instance
      .get("/cuentasBancarias")
      .then(function (response) {
        // handle success
        //console.log(response.data);
        setCuentasBancarias(response.data.cuentas);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  return (
    <div>
      <div className="w-100 mt-4 pb-5 px-2">
        {cuentasBancarias.length
          ? cuentasBancarias.map((cuenta, index) => (
              <div key={index} className="row m-0 rounded-3 p-2 datos-banco mb-3 py-2">
                <div className="col-lg-2 col-md-12 col-xs-12 border-end d-flex align-items-center justify-content-center">
                  <img src={cuenta.logo_banco} className="img-carusel rounded-2" />
                </div>
                <div className="col-lg-10 col-md-12 col-xs-12 mt-2">
                  <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
                    <p className="m-0 w-25">Nombre:</p>
                    <p className="m-0 w-75">{cuenta.titularCuenta}</p>
                  </div>
                  <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
                    <p className="m-0 w-25">Clabe:</p>
                    <p className="m-0 w-75">{cuenta.clabe}</p>
                  </div>
                  <div className="d-flex" style={{ fontSize: "15px" }}>
                    <p className="m-0 w-25">No. Tarjeta:</p>
                    <p className="m-0 w-75">{cuenta.no_tarjeta}</p>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
