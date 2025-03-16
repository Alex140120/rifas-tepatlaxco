import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ModalAgregarBoletos from "./ModalAgregarBoletos";
import { getData } from "../../api/apiRequest";
import Spinner from "../../components/Tags/Spinner";

interface DatosProductoI {
  id: number;
  rangoInicial: number;
  rangoFinal: number;
  precioBoleto: number;
}

interface ProductoResponseI {
  producto: DatosProductoI;
}

export default function Boletos() {
  const [carga, setCarga] = useState<boolean>(false);

  const [idProducto, setIdProducto] = useState<number | null>(null);

  const [rangoInicialBoletos, setRangoInicialBoletos] = useState<number | null>(
    null
  );
  const [rangoFinalBoletos, setRangoFinalBoletos] = useState<number | null>(
    null
  );

  const [showAddBoletos, setShowAddBoletos] = useState<boolean>(false);

  const [precioBoleto, setPrecioBoleto] = useState<number | null>(null);

  const [propiedades, setPropiedades] = useState<Record<string, string>>({});

  const [boletosSeleccionados, setBoletosSeleccionados] = useState<number[]>(
    []
  );

  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    extraerProductoRifado();
  }, []);

  const extraerProductoRifado = async () => {
    try {
      const response = await getData<ProductoResponseI>(
        "extraerBoletosRifaActiva",
        null
      );
      const { status, data } = response;
      //console.log(status);
      console.log(data);
      if (status === 204) {
      }
      if (status === 200) {
        setIdProducto(data.producto.id);
        setPrecioBoleto(data.producto.precioBoleto);
        setRangoInicialBoletos(data.producto.rangoInicial);
        setRangoFinalBoletos(data.producto.rangoFinal);
      }
    } catch (error: any) {
      if (error.response) {
        // obtener el status y los datos de la respuesta
        const { status, data } = error.response;
        console.log(
          `status: ${status} | error: ${data.error} | message: ${data.message}`
        );
      } else {
        // Si no hay `response` (error de red u otro problema)
        console.log("Error de red o configuración:", error.message);
      }
    } finally {
      setCarga(true);
    }
  };

  // Agregar las propiedades de los boletos
  useEffect(() => {
    if (idProducto && rangoInicialBoletos && rangoFinalBoletos) {
      for (
        let index = rangoInicialBoletos;
        index <= rangoFinalBoletos;
        index++
      ) {
        setPropiedades((prevProp) => ({
          ...prevProp,
          [`bto${index}`]: "bg-inactive",
        }));
      }
    }
  }, [idProducto, rangoInicialBoletos, rangoFinalBoletos]);

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

  const handleRenderizarBoletos = () => {
    setCarga(false);
    setIdProducto(null);
    setPrecioBoleto(null);
    setRangoInicialBoletos(null);
    setRangoFinalBoletos(null);
    setShowAddBoletos(false);
    setPropiedades({});
    setBoletosSeleccionados([]);
    extraerProductoRifado();
  };

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
      {carga ? (
        <>
          {showAddBoletos ? (
            <div className="w-100 d-flex justify-content-center mt-3 expand-animation">
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

          <div className="w-100 mt-3 p-1 d-flex align-items-center justify-content-center mb-5 expand-animation">
            <div
              id="boletos"
              className="container-boletos rounded-3 py-2 px-3 d-flex flex-row gap-2 flex-wrap justify-content-between"
            >
              {idProducto && rangoInicialBoletos && rangoFinalBoletos ? (
                <>
                  {Array.from(
                    {
                      length: rangoFinalBoletos - rangoInicialBoletos + 1,
                    },
                    (_, index: number) => {
                      const boletoIndex = rangoInicialBoletos + index;
                      return (
                        <button
                          key={boletoIndex}
                          className={`btn btn-boleto py-1 px-2 ${
                            propiedades[`bto${boletoIndex}`]
                          }`}
                          onClick={() => handleSeleccionarBoleto(boletoIndex)}
                        >
                          {boletoIndex}
                        </button>
                      );
                    }
                  )}
                </>
              ) : (
                <div className="w-100 text-center">
                  <h6>No hay boletos disponibles.</h6>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="w-100 text-center">
          <Spinner />
        </div>
      )}

      <ModalAgregarBoletos
        show={show}
        handleClose={handleClose}
        boletos={boletosSeleccionados}
        precioBoleto={precioBoleto}
        datosGuardados={handleRenderizarBoletos}
      />
    </div>
  );
}
