import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ModalAgregarBoletos from "./ModalAgregarBoletos";

export default function Boletos() {
  const numBoletos = 120;

  const [showAddBoletos, setShowAddBoletos] = useState<boolean>(false);

  const [propiedades, setPropiedades] = useState<Record<string, string>>({});

  const [boletosSeleccionados, setBoletosSeleccionados] = useState<number[]>(
    []
  );

  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Agregar las propiedades de los boletos
  useEffect(() => {
    for (let index = 0; index < numBoletos; index++) {
      setPropiedades((prevProp) => ({
        ...prevProp,
        [`bto${index}`]: "bg-inactive",
      }));
    }
  }, []);

  const handleSeleccionarBoleto = (index: number) => {
    const boleto = propiedades[`bto${index}`];

    if (boleto === "bg-active") {
      // Si el boleto está inactivo, elimina el índice del array de seleccionados
      setBoletosSeleccionados((prevSeleccionados) =>
        prevSeleccionados.filter((item) => item !== index)
      );
    } else {
      // Si el boleto está activo, añade el índice al array de seleccionados
      setBoletosSeleccionados((prevBoletosSeleccionados) => [
        ...prevBoletosSeleccionados,
        index,
      ]);
    }

    // Agregar o quitar la clase de las propiedades de los boletos
    setPropiedades((prevProp) => ({
      ...prevProp,
      [`bto${index}`]: boleto === "bg-inactive" ? "bg-active" : "bg-inactive",
    }));
  };

  // Detectar que exista un boleto seleccionado
  useEffect(() => {
    const existeActivo = Object.values(propiedades).some(
      (value) => value == "bg-active"
    );
    setShowAddBoletos(existeActivo);
  }, [propiedades]);

  return (
    <div>
      <div className="row m-0 mt-3">
        <div className="col-lg-4 col-md-3 col-xs-2 d-flex align-items-center justify-content-center text-dark p-0">
          <span className="separator"></span>
        </div>
        <div className="col-lg-4 col-md-6 col-xs-8 d-flex align-items-center justify-content-center text-dark">
          <h3>Selecciona tus boletos</h3>
        </div>
        <div className="col-lg-4 col-md-3 col-xs-2 d-flex align-items-center justify-content-center text-dark p-0">
          <span className="separator"></span>
        </div>
      </div>
      {showAddBoletos ? (
        <div className="w-100 d-flex justify-content-center mt-3">
          <button
            className="btn btn-add-boletos outline-none rounded-4"
            onClick={() => {
                handleShow();
            }}
          >
            <FontAwesomeIcon icon={faAdd} className="me-1" />
            Agregar Boletos
          </button>
        </div>
      ) : null}

      <div className="w-100 mt-3 p-1 d-flex align-items-center justify-content-center mb-5">
        <div
          id="boletos"
          className="container-boletos rounded-3 py-2 px-3 d-flex flex-row gap-2 flex-wrap justify-content-between"
        >
          {Array.from({ length: numBoletos }, (_, index: number) => (
            <button
              key={index}
              className={`btn btn-boleto py-1 px-2 ${
                propiedades[`bto${index}`]
              }`}
              onClick={() => {
                handleSeleccionarBoleto(index);
              }}
            >
              {index}
            </button>
          ))}
        </div>
      </div>

      <ModalAgregarBoletos show={show} handleClose={handleClose} boletos={boletosSeleccionados}/>
    </div>
  );
}
