import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUp19,
  faCreditCard,
  faFileUpload,
  faHashtag,
  faMap,
  faMapLocation,
  faSave,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import ModalMetodosdePago from "./ModalMetodosdePago";
import Alerta from "../../components/Alertas/Alerta";

interface Props {
  show: boolean;
  handleClose: () => void;
  boletos: number[];
}

export default function ModalAgregarBoletos({
  show,
  handleClose,
  boletos,
}: Props) {
  const [boletosUsuario, setBoletosUsuario] = useState<number[]>([]);

  const [nombre, setNombre] = useState<string>("");
  const [numTelefono, setNumTelefono] = useState<string>("");
  const [estado, setEstado] = useState<string | number>("");
  const [localidad, setLocalidad] = useState<string | number>("");
  const [domicilio, setDomicilio] = useState<string>("");
  const [codigoPostal, setCodigoPostal] = useState<string | number>("");

  const [tituloModal, setTituloModal] = useState("Apartar Boletos");
  const [contenido, setContenido] = useState<JSX.Element>(<></>);
  const [alerta, setAlerta] = useState<JSX.Element>(<></>);

  const [mostrarOcultarBtn, setMostrarOcultarBtn] = useState<boolean>(false);

  useEffect(() => {
    if (show && boletos.length) {
      setBoletosUsuario(boletos);
    } else {
      setContenido(<></>);
      setBoletosUsuario([]);
      setAlerta(<></>);
      setTituloModal("Apartar Boletos");
      setMostrarOcultarBtn(false);
    }
  }, [show]);

  // General el contenido
  useEffect(() => {
    if (boletosUsuario.length) {
      setContenido(
        <div className="w-100 text-center">
          <p className="m-0">Boletos seleccionados:</p>
          <div className="d-flex flex-row gap-2 mt-2 w-100 justify-content-center flex-wrap">
            {boletos.map((item, index) => (
              <span
                className="m-0 btn btn-boleto py-1 px-2 bg-active"
                key={index}
              >
                {item}
              </span>
            ))}
          </div>
          <p className="m-0 mt-3">Total a pagar:</p>
          <p className="m-0 mt-1 t0 fw-bold">$200</p>
          <hr />
          <div className="d-flex justify-content-left flex-column">
            <p className="m-0 text-start">
              Llena los campos con la información correspondiente:
            </p>
            <div className="row m-0 mt-2">
              {/* Nombre */}
              <div className="col-lg-6 col-md-6 col-xs-12 mb-2">
                <div className="border rounded-2 d-flex align-items-center">
                  <span className="fs-8 mx-2">
                    <FontAwesomeIcon icon={faUser} className="icon-color" />
                  </span>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-100 border-0 rounded-end-2 px-1 py-1 icon-color"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                    }}
                  />
                </div>
              </div>
              {/* Numero Telefono */}
              <div className="col-lg-6 col-md-6 col-xs-12 mb-2">
                <div className="border rounded-2 d-flex align-items-center">
                  <span className="fs-8 mx-2">
                    <FontAwesomeIcon icon={faWhatsapp} className="icon-color" />
                  </span>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Número de teléfono"
                    className="w-100 border-0 rounded-end-2 px-1 py-1 icon-color"
                    pattern="[0-9]*"
                    value={numTelefono}
                    onChange={(e) => {
                      setNumTelefono(handleChangeNumero(e.target.value));
                    }}
                  />
                </div>
              </div>
              {/* Estado */}
              <div className="col-lg-6 col-md-6 col-xs-12 mb-2">
                <div className="border rounded-2 d-flex align-items-center">
                  <span className="fs-8 mx-2">
                    <FontAwesomeIcon icon={faMap} className="icon-color" />
                  </span>
                  <select
                    className="w-100 border-0 rounded-end-2 px-1 py-1 icon-color"
                    value={estado}
                    onChange={(e) => {
                      setEstado(e.target.value);
                    }}
                  >
                    <option value="">Estado</option>
                    <option value="1">Puebla</option>
                  </select>
                </div>
              </div>
              {/* Localidad */}
              <div className="col-lg-6 col-md-6 col-xs-12 mb-2">
                <div className="border rounded-2 d-flex align-items-center">
                  <span className="fs-8 mx-2">
                    <FontAwesomeIcon
                      icon={faMapLocation}
                      className="icon-color"
                    />
                  </span>
                  <select
                    className="w-100 border-0 rounded-end-2 px-1 py-1 icon-color"
                    value={localidad}
                    onChange={(e) => {
                      setLocalidad(e.target.value);
                    }}
                  >
                    <option value="">Localidad</option>
                    <option value="1">Tepatlaxco de Hidalgo</option>
                  </select>
                </div>
              </div>
              {/* Calle y Numero */}
              <div className="col-lg-6 col-md-6 col-xs-12 mb-2">
                <div className="border rounded-2 d-flex align-items-center">
                  <span className="fs-8 mx-2">
                    <FontAwesomeIcon icon={faHashtag} className="icon-color" />
                  </span>
                  <input
                    type="text"
                    placeholder="Calle y número"
                    className="w-100 border-0 rounded-end-2 px-1 py-1 icon-color"
                    value={domicilio}
                    onChange={(e) => {
                      setDomicilio(e.target.value);
                    }}
                  />
                </div>
              </div>
              {/* Codigo Postal */}
              <div className="col-lg-6 col-md-6 col-xs-12 mb-2">
                <div className="border rounded-2 d-flex align-items-center">
                  <span className="fs-8 mx-2">
                    <FontAwesomeIcon
                      icon={faArrowUp19}
                      className="icon-color"
                    />
                  </span>
                  <input
                    type="text"
                    placeholder="Código postal"
                    className="w-100 border-0 rounded-end-2 px-1 py-1 icon-color"
                    value={codigoPostal}
                    onChange={(e) => {
                      setCodigoPostal(handleChangeNumero(e.target.value));
                    }}
                  />
                </div>
              </div>
              {/* Archivo */}
              <div className="col-lg-12 col-md-12 col-xs-12 mb-2">
                <div className="border rounded-2 d-flex align-items-center">
                  <span className="fs-8 px-3">
                    <FontAwesomeIcon
                      icon={faFileUpload}
                      className="icon-color"
                    />
                  </span>
                  <label htmlFor="ine" className="py-1 icon-color">
                    Subir identificación
                  </label>
                  <input
                    id="ine"
                    name="ine"
                    type="file"
                    placeholder="Código postal"
                    className="w-100 border-0 rounded-end-2 px-1 py-1 icon-color d-none"
                    accept=".pdf"
                  />
                </div>
              </div>
            </div>

            <div className="w-100 mt-3">{alerta}</div>

            <div className="w-100 mt-3">
              {mostrarOcultarBtn ? (
                <button
                  className="btn btn-warning outline-none text-light"
                  onClick={() => verMetodosPago()}
                >
                  <FontAwesomeIcon icon={faCreditCard} className="me-1" />{" "}
                  Métodos de Pago
                </button>
              ) : (
                <button
                  className="btn btn-success outline-none"
                  onClick={() => handleGuardarDatos()}
                >
                  <FontAwesomeIcon icon={faSave} className="me-1" /> Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  }, [
    boletosUsuario,
    nombre,
    numTelefono,
    estado,
    localidad,
    domicilio,
    codigoPostal,
    alerta,
    mostrarOcultarBtn
  ]);

  const handleChangeNumero = (numero: any) => {
    const numeroNuevo = numero.replace(/[^0-9]/g, ""); // Solo números
    return numeroNuevo;
  };

  const handleGuardarDatos = () => {
    if (
      nombre !== "" &&
      numTelefono !== "" &&
      estado !== "" &&
      localidad !== "" &&
      domicilio !== "" &&
      codigoPostal !== ""
    ) {
      const datos = {
        nombre,
        numTelefono,
        estado,
        localidad,
        domicilio,
        codigoPostal,
        boletosUsuario,
      };

      console.log(datos);
      setTimeout(() => {
        setAlerta(
          <Alerta
            clases="alerta-success"
            header=""
            body={`Tus datos han sido guardados exitosamente. <br/> 
              Presiona el botón "Métodos de Pago" para ver todas las cuentas donde puedes realizar las transferencias por el monto correspondiente.`}
          />
        );
        setMostrarOcultarBtn(true);
      }, 2000);
    } else {
      setAlerta(
        <Alerta
          clases="alerta-danger"
          header="¡ERROR!"
          body="Completa todos los campos."
        />
      );
    }
  };

  function verMetodosPago () {
    setTituloModal("Métodos de Pago");
    setContenido(<ModalMetodosdePago/>);
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      keyboard={false}
      centered
      className="modal-lg"
    >
      <Modal.Header className="d-flex justify-content-center align-items-center">
        <Modal.Title>
          <div>
            <h3>{tituloModal}</h3>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{contenido}</Modal.Body>
      <Modal.Footer>
        <button
          className="btn-bancos rounded-4 mt-2 py-1 px-2 outline-none m-auto"
          onClick={() => handleClose()}
        >
          Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  );
}
