import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { CuentasBancariasI } from "../../constants/Interfaces-ts";

import instance from "../../api/axios";

import MercadoPago from "../../assets/img/mercadopago.png";
import BancoAzteca from "../../assets/img/bancoazteca.png";
import HSBC from "../../assets/img/hsbc.jpg";
import NU from "../../assets/img/nu.jpg";

interface Props {
  show: boolean;
  handleClose: () => void;
  tipoBanco: number;
}

export default function MetodoPago({ show, handleClose, tipoBanco }: Props) {
  const [carga, setCarga] = useState<boolean>(false);

  const [nombreBanco, setNombreBanco] = useState<string>("");
  const [imagenBanco, setImagenBanco] = useState<string>("");

  const [cuentasBancarias, setCuentasBancarias] = useState<CuentasBancariasI[]>(
    []
  );

  useEffect(() => {
    if (show) {
      asignarNombreBanco(tipoBanco);
      extraerCuentasBanco(tipoBanco);
    } else {
      setCuentasBancarias([]);
      setCarga(false);
    }
  }, [show]);

  function asignarNombreBanco(key: number) {
    switch (key) {
      case 1:
        setNombreBanco("Banco Azteca");
        setImagenBanco(BancoAzteca);
        break;
      case 2:
        setNombreBanco("NU");
        setImagenBanco(NU);
        break;
      case 3:
        setNombreBanco("HSBC");
        setImagenBanco(HSBC);
        break;
      case 4:
        //return "Mercado Pago";
        setNombreBanco("Mercado Pago");
        setImagenBanco(MercadoPago);
        break;
      default:
        setNombreBanco("");
        setImagenBanco("");
        break;
    }
  }

  const extraerCuentasBanco = async (tipoBanco: number) => {
    try {
      const response = await instance.get("cuentasbancoseleccionado", {
        params: { tipoBanco },
      });
      //console.log(response.data);
      setCuentasBancarias(response.data.cuentas);
    } catch (error) {
      console.log(error);
    } finally {
      setCarga(true);
    }
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header>
          <Modal.Title>
            <div className="w-100 d-flex align-items-center justify-content-center">
              <img src={imagenBanco} width={60} height={45} className="me-2" />
              <p className="m-0 banco-header">{nombreBanco}</p>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100">
            {carga ? (
              cuentasBancarias.length ? (
                cuentasBancarias.map((cuenta, index) => (
                  <div
                    key={index}
                    className="w-100 bg-light rounded-3 p-2 datos-banco mb-3 expand-animation"
                  >
                    <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
                      <p className="m-0 w-25">Nombre:</p>
                      <p className="m-0 w-75">{cuenta.titularCuenta}</p>
                    </div>
                    <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
                      <p className="m-0 w-25">Clabe:</p>
                      <p className="m-0 w-75">{cuenta.clabe}</p>
                    </div>
                    <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
                      <p className="m-0 w-25">No. Tarjeta:</p>
                      <p className="m-0 w-75">{cuenta.no_tarjeta}</p>
                    </div>
                    <div className="d-flex" style={{ fontSize: "15px" }}>
                      <p className="m-0 w-25">Teléfono:</p>
                      <p className="m-0 w-75">{cuenta.telefono}</p>
                    </div>
                  </div>
                ))
              ) : (
                <h5>No se encontraron cuentas relacionadas a este banco.</h5>
              )
            ) : (
              <div className="w-100 text-center">
                <p className="m-0">Cargando...</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn-bancos rounded-4 mt-2 py-1 px-2 outline-none m-auto"
            onClick={() => handleClose()}
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
