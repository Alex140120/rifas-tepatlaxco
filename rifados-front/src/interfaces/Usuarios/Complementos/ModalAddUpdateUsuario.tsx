import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Spinner from "../../../components/Tags/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import InputText from "../../../components/Tags/InputText";
import Alerta from "../../../components/Alertas/Alerta";
import { postData } from "../../../api/apiRequest";
import {
  notifyError,
  notifySuccess,
} from "../../../components/Alertas/Alertas";

interface FilasI {
  id: number;
  usuariocorreo: string;
  password: string;
  nombres: string;
  apellido_p: string;
  apellido_m: string;
  telefono: string;
  correo: string;
  [key: string]: any; // Firma de índice añadida
}

interface Props {
  show: boolean;
  handleClose: () => void;
  tituloModal: string;
  actualizarRegistros: () => void;
  datosUsuario: FilasI | null;
}

export default function ModalAddUpdateUsuario({
  show,
  handleClose,
  tituloModal,
  actualizarRegistros,
  datosUsuario,
}: Props) {
  const [carga, setCarga] = useState<boolean>(false);

  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [nombres, setNombres] = useState<string>("");
  const [apellidoP, setApellidoP] = useState<string>("");
  const [apellidoM, setApellidoM] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");

  const [alerta, setAlerta] = useState<boolean>(false);

  // Carga inicial
  useEffect(() => {
    if (show) {
      if (tituloModal === "Agregar") {
        setCarga(true);
      } else if (tituloModal === "Modificar") {
        if (datosUsuario !== null) {
          setIdUsuario(datosUsuario.id);
          setNombres(datosUsuario.nombres);
          setApellidoP(datosUsuario.apellido_p);
          setApellidoM(datosUsuario.apellido_m);
          setCorreo(datosUsuario.correo);
          setUserName(datosUsuario.usuariocorreo);
          setPassword(datosUsuario.password);
          setTelefono(datosUsuario.telefono);
          setCarga(true);
        }
      }
    } else {
      setCarga(false);
      limpiarCampos();
    }
  }, [show]);

  const handleGuardarUsuario = () => {
    if (
      nombres === "" ||
      apellidoP === "" ||
      apellidoM === "" ||
      correo === "" ||
      userName === "" ||
      password === "" ||
      telefono === ""
    ) {
      setAlerta(true);
      return null;
    }

    const datos = {
      idUsuario,
      nombres,
      apellido_p: apellidoP,
      apellido_m: apellidoM,
      correo,
      usuariocorreo: userName,
      password,
      telefono,
    };

    if (tituloModal === "Agregar") {
      agregarNuevoUsuario(datos);
    } else if (tituloModal === "Modificar") {
      modificarUsuario(datos);
    }
  };

  const agregarNuevoUsuario = async (datos: object) => {
    try {
      const response = await postData("agregarNuevoUsuario", datos);
      const { status } = response;
      if (status === 200) {
        setTimeout(() => {
          actualizarRegistros();
          limpiarCampos();
          handleClose();
        }, 400);
        notifySuccess("¡Usuario registrado!", "top-center");
      }
    } catch (error: any) {
      if (error.response) {
        // obtener el status y los datos de la respuesta
        const { status, data } = error.response;

        if (status === 500) {
          notifyError("Ocurrió un error, intente más tarde.", "top-center");
        }

        if (status === 409) {
          notifyError("El nombre de usuario ya existe.", "top-center", 2500);
        }

        console.log(
          `status: ${status} | error: ${data.error} | message: ${data.message}`
        );
      } else {
        // Si no hay `response` (error de red u otro problema)
        console.log("Error de red o configuración:", error.message);
      }
    }
  };

  const modificarUsuario = async (datos: object) => {
    // Si algunos de los campos ha cambiado
    if (
      datosUsuario?.nombres !== nombres ||
      datosUsuario.apellido_p !== apellidoP ||
      datosUsuario.apellido_m !== apellidoM ||
      datosUsuario.correo !== correo ||
      datosUsuario.usuariocorreo !== userName ||
      datosUsuario.password !== password ||
      datosUsuario.telefono !== telefono
    ) {
      try {
        const response = await postData("modificarUsuario", datos);
        const { status } = response;
        if (status === 200) {
          setTimeout(() => {
            actualizarRegistros();
            limpiarCampos();
            handleClose();
          }, 400);
          notifySuccess("¡Usuario actualizado!", "top-center");
        }
      } catch (error: any) {
        if (error.response) {
          // obtener el status y los datos de la respuesta
          const { status, data } = error.response;

          if (status === 500) {
            notifyError("Ocurrió un error, intente más tarde.", "top-center");
          }

          if (status === 409) {
            notifyError("El nombre de usuario ya existe.", "top-center", 2500);
          }

          console.log(
            `status: ${status} | error: ${data.error} | message: ${data.message}`
          );
        } else {
          // Si no hay `response` (error de red u otro problema)
          console.log("Error de red o configuración:", error.message);
        }
      }
    } else {
      handleClose();
      limpiarCampos();
    }
  };

  function limpiarCampos() {
    setIdUsuario(null);
    setNombres("");
    setApellidoP("");
    setApellidoM("");
    setCorreo("");
    setUserName("");
    setPassword("");
    setTelefono("");
    setAlerta(false);
  }

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span className="text-grey">{tituloModal} Usuario</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            {carga ? (
              <>
                {/* Nombres */}
                <div className="w-100 mb-3">
                  <p className="m-0 mb-1 text-grey t3">Nombre(s)* :</p>
                  <InputText
                    disabled={false}
                    placeHolder="Nombre(s)"
                    tipoValor="texto"
                    valor={nombres}
                    onChange={(e) => {
                      setAlerta(false);
                      setNombres(e);
                    }}
                  />
                </div>

                {/* Apellido Paterno */}
                <div className="w-100 mb-3">
                  <p className="m-0 mb-1 text-grey t3">Apellido Paterno* :</p>
                  <InputText
                    disabled={false}
                    placeHolder="Apellido paterno"
                    tipoValor="texto"
                    valor={apellidoP}
                    onChange={(e) => {
                      setAlerta(false);
                      setApellidoP(e);
                    }}
                  />
                </div>

                {/* Apellido Materno */}
                <div className="w-100 mb-3">
                  <p className="m-0 mb-1 text-grey t3">Apellido Materno* :</p>
                  <InputText
                    disabled={false}
                    placeHolder="Apellido materno"
                    tipoValor="texto"
                    valor={apellidoM}
                    onChange={(e) => {
                      setAlerta(false);
                      setApellidoM(e);
                    }}
                  />
                </div>

                {/* Correo */}
                <div className="w-100 mb-3">
                  <p className="m-0 mb-1 text-grey t3">Correo electrónico* :</p>
                  <InputText
                    disabled={false}
                    placeHolder="Correo electrónico"
                    tipoValor="texto"
                    valor={correo}
                    onChange={(e) => {
                      setAlerta(false);
                      setCorreo(e);
                    }}
                  />
                </div>

                {/* Nombre de usuario */}
                <div className="w-100 mb-3">
                  <p className="m-0 mb-1 text-grey t3">Nombre de usuario* :</p>
                  <InputText
                    disabled={false}
                    placeHolder="Nombre de usuario"
                    tipoValor="texto"
                    valor={userName}
                    onChange={(e) => {
                      setAlerta(false);
                      setUserName(e);
                    }}
                  />
                </div>

                {/* Contraseña */}
                <div className="w-100 mb-3">
                  <p className="m-0 mb-1 text-grey t3">Contraseña* :</p>
                  <InputText
                    disabled={false}
                    placeHolder="Contraseña"
                    tipoValor="texto"
                    valor={password}
                    onChange={(e) => {
                      setAlerta(false);
                      setPassword(e);
                    }}
                  />
                </div>

                {/* Telefono */}
                <div className="w-100 mb-3">
                  <p className="m-0 mb-1 text-grey t3">Teléfono* :</p>
                  <InputText
                    disabled={false}
                    placeHolder="Teléfono"
                    tipoValor="texto"
                    valor={telefono}
                    onChange={(e) => {
                      setAlerta(false);
                      setTelefono(e);
                    }}
                  />
                </div>

                {alerta ? (
                  <div className="w-100 mt-3 t4 expand-animation">
                    <Alerta
                      clases="alerta-danger"
                      header="¡ERROR!"
                      body={"Todos los campos son OBLIGATORIOS."}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <div className="w-100 text-center py-1">
                <Spinner />
              </div>
            )}
          </>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn-primary-rifas  text-light rounded-2 mt-2 py-1 px-2 outline-none m-auto"
            onClick={() => {
              handleGuardarUsuario();
            }}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
