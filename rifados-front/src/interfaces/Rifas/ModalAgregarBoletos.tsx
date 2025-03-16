import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUp19,
  faCreditCard,
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
import Swal from "sweetalert2";
import instance from "../../api/axios";
import InputFile from "../../components/Tags/InputFile";
import { postData } from "../../api/apiRequest";

interface Props {
  show: boolean;
  handleClose: () => void;
  boletos: number[];
  precioBoleto: number | null;
}

interface EstadosI {
  id: number;
  nombre: string;
}

interface LocalidadesI {
  cp: string;
  localidad: string;
  estado: string;
  tipo: string;
}

export default function ModalAgregarBoletos({
  show,
  handleClose,
  boletos,
  precioBoleto,
}: Props) {
  const [pagoTotal, setPagoTotal] = useState<number>(0);

  const [boletosUsuario, setBoletosUsuario] = useState<number[]>([]);

  const [nombre, setNombre] = useState<string>("");
  const [numTelefono, setNumTelefono] = useState<string>("");

  const [estado, setEstado] = useState<string | number>("");
  const [estados, setEstados] = useState<EstadosI[]>([]);

  const [localidad, setLocalidad] = useState<string | number>("");
  const [localidades, setLocalidades] = useState<LocalidadesI[]>([]);

  const [domicilio, setDomicilio] = useState<string>("");
  const [codigoPostal, setCodigoPostal] = useState<string | number>("");

  const [tituloModal, setTituloModal] = useState("Apartar Boletos");
  const [contenido, setContenido] = useState<JSX.Element>(<></>);
  const [alerta, setAlerta] = useState<JSX.Element>(<></>);

  const [archivoSubido, setArchivoSubido] = useState<boolean>(false);

  const [mostrarOcultarBtn, setMostrarOcultarBtn] = useState<boolean>(false);

  useEffect(() => {
    if (show && boletos.length) {
      setBoletosUsuario(boletos);
      if (precioBoleto) {
        setPagoTotal(precioBoleto * boletos.length);
      }
      obtenerEstados();
    } else {
      setPagoTotal(0);
      setContenido(<></>);
      setBoletosUsuario([]);
      setAlerta(<></>);
      setTituloModal("Apartar Boletos");
      setMostrarOcultarBtn(false);
    }
  }, [show]);

  // Estados
  const obtenerEstados = async () => {
    try {
      const response = await instance.get("/obtenerEstadosMexicanos");
      //console.log(response.data);
      setEstados(response.data.estados);
    } catch (error) {
      console.log(error);
    }
  };

  // onChange estado
  useEffect(() => {
    setLocalidad("");
    setLocalidades([]);
    if (estado) {
      const obtenerLocalidadesEstado = (estado: number | string) => {
        instance
          .get("/localidadesEstado", { params: { estado } })
          .then(function (response) {
            //console.log(response.data);
            setLocalidades(response.data.lodalidades);
          })
          .catch(function (error) {
            console.log(error);
          });
      };
      obtenerLocalidadesEstado(estado);
    }
  }, [estado]);

  const handleSeleccionaLocalidad = (localidad: string) => {
    setLocalidad(localidad);

    // obtener el objeto para extraer el codigo postal
    const localidadObj: LocalidadesI | undefined = localidades.find(
      (local) => local.localidad === localidad
    );
    setCodigoPostal(localidadObj?.cp ?? "");
  };

  const handleSubirArchivo = async (formData: FormData) => {
    try {
      const response = await instance.post("/subirArchivo", formData);

      //console.log(response.data);
      setArchivoSubido(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

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
          <p className="m-0 mt-1 t0 fw-bold">${pagoTotal}</p>
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
                    {estados.length &&
                      estados.map((edo, index) => (
                        <option key={index} value={edo.id}>
                          {edo.nombre}
                        </option>
                      ))}
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
                      handleSeleccionaLocalidad(e.target.value);
                    }}
                  >
                    <option value="">Localidad</option>
                    {localidades
                      ? localidades.map((local, index) => (
                          <option key={index} value={local.localidad}>
                            {local.localidad}
                          </option>
                        ))
                      : null}
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
                <div className="w-100 text-start mt-2">
                  <span className="t3 text-grey">
                    Adjunta una imagen o archivo de tu identificación oficial
                    (INE) en formato ".jpg", ".png", ".jpeg" o ".pdf":
                  </span>
                </div>
                <InputFile
                  extensiones=".pdf, .jpg, .png, .jpeg"
                  multiple={false}
                  onFormDataReady={handleSubirArchivo}
                />
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
    estados,
    localidad,
    localidades,
    domicilio,
    codigoPostal,
    alerta,
    mostrarOcultarBtn,
    archivoSubido,
  ]);

  const handleChangeNumero = (numero: any) => {
    const numeroNuevo = numero.replace(/[^0-9]/g, ""); // Solo números
    return numeroNuevo;
  };

  const handleGuardarDatos = () => {
    const datos = {
      nombre,
      numTelefono,
      estado,
      localidad,
      domicilio,
      codigoPostal,
      archivoSubido,
    };
    console.log(datos);

    if (
      nombre !== "" &&
      numTelefono !== "" &&
      estado !== "" &&
      localidad !== "" &&
      domicilio !== "" &&
      codigoPostal !== "" &&
      archivoSubido
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

      Swal.fire({
        title: "",
        text: `Si tus datos son correctos, presiona "Aceptar" para continuar.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#05c7a7",
        confirmButtonText: "Aceptar",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          ejecutarGuardadoDatos(datos);
        }
      });
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

  const ejecutarGuardadoDatos = async (datos: Object) => {
    console.log(datos);
    try {
      const response = await postData("guardarDatosRifa", datos);
      const { status, data } = response;
      if (status === 200) {
        setAlerta(
          <Alerta
            clases="alerta-success"
            header=""
            body={`Tus datos han sido guardados exitosamente. <br/> 
              Presiona el botón "Métodos de Pago" para ver todas las cuentas donde puedes realizar las transferencias por el monto correspondiente.`}
          />
        );
        setMostrarOcultarBtn(true);
      }
    } catch (error: any) {
      if (error.response) {
        setAlerta(
          <Alerta
            clases="alerta-danger"
            header=""
            body={`Algo salió mal. <br/> 
              Sus datos no se han podido guardar, inténtelo nuevamente.`}
          />
        );
        // obtener el status y los datos de la respuesta
        const { status, data } = error.response;
        console.log(
          `status: ${status} | error: ${data.error} | message: ${data.message}`
        );
      } else {
        // Si no hay `response` (error de red u otro problema)
        console.log("Error de red o configuración:", error.message);
      }
    }
  };

  function verMetodosPago() {
    setTituloModal("Métodos de Pago");
    setContenido(<ModalMetodosdePago />);
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
