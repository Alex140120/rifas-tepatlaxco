import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

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
  const [nombreBanco, setNombreBanco] = useState<string>("");
  const [imagenBanco, setImagenBanco] = useState<string>("");

  useEffect(() => {
    if (show) {
      asignarNombreBanco(tipoBanco);
    }
  }, [show]);

  function asignarNombreBanco(key: number) {
    switch (key) {
      case 1:
        //return "Mercado Pago";
        setNombreBanco("Mercado Pago");
        setImagenBanco(MercadoPago);
        break;
      case 2:
        setNombreBanco("Banco Azteca");
        setImagenBanco(BancoAzteca);
        break;
      case 3:
        setNombreBanco("HSBC");
        setImagenBanco(HSBC);
        break;
      case 4:
        setNombreBanco("NU");
        setImagenBanco(NU);
        break;
      default:
        setNombreBanco("");
        setImagenBanco("");
        break;
    }
  }

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
            <div className="w-100 bg-light rounded-3 p-2 datos-banco mb-3">
              <div
                className="d-flex mb-1"
                style={{ fontSize: "15px" }}
              >
                <p className="m-0 w-25">Nombre:</p>
                <p className="m-0 w-75">Nombre del titular de la cuenta</p>
              </div>
              <div
                className="d-flex mb-1"
                style={{ fontSize: "15px" }}
              >
                <p className="m-0 w-25">Clabe:</p>
                <p className="m-0 w-75">12542154787</p>
              </div>
              <div className="d-flex" style={{ fontSize: "15px" }}>
                <p className="m-0 w-25">No. Tarjeta:</p>
                <p className="m-0 w-75">12457845</p>
              </div>
            </div>

            <div className="w-100 bg-light rounded-3 p-2 datos-banco">
              <div
                className="d-flex mb-1"
                style={{ fontSize: "15px" }}
              >
                <p className="m-0 w-25">Nombre:</p>
                <p className="m-0 w-75">Nombre del titular de la cuenta</p>
              </div>
              <div
                className="d-flex mb-1"
                style={{ fontSize: "15px" }}
              >
                <p className="m-0 w-25">Clabe:</p>
                <p className="m-0 w-75">12542154787</p>
              </div>
              <div className="d-flex" style={{ fontSize: "15px" }}>
                <p className="m-0 w-25">No. Tarjeta:</p>
                <p className="m-0 w-75">12457845</p>
              </div>
            </div>
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
