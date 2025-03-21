import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import InputText from "../../../components/Tags/InputText";
import { useEffect, useState } from "react";
import SelectOption from "../../../components/Tags/SelectOption";
import {
  notifyError,
  notifySuccess,
} from "../../../components/Alertas/Alertas";
import { getData, postData } from "../../../api/apiRequest";
import Spinner from "../../../components/Tags/Spinner";
import Alerta from "../../../components/Alertas/Alerta";
import Swal from "sweetalert2";

interface FilasI {
  id: number;
  titular: string;
  clabe: string;
  no_tarjeta: string;
  nombre_banco: string;
  logo_banco: string;
  [key: string]: any; // Firma de índice añadida
}

interface Props {
  show: boolean;
  handleClose: () => void;
  tituloModal: string | null;
  datosCuenta: FilasI | null;
  actualizarCuentas: () => void;
}

interface OpcionesI {
  id: number | string;
  opcion: number | string;
  disabled: boolean;
}

interface ResponseGetI {
  usuarios: OpcionesI[];
  bancos: OpcionesI[];
}

export default function ModalAddUpdateAccount({
  show,
  handleClose,
  tituloModal,
  actualizarCuentas,
}: Props) {
  const [carga, setCarga] = useState<boolean>(false);

  const [clabe, setClabe] = useState<string | number>("");

  const [tarjeta, setTarjeta] = useState<string | number>("");

  const [bancosRegistrados, setBancosRegistrados] = useState<OpcionesI[]>([]);
  const [banco, setBanco] = useState<string | number>("");

  const [titulares, setTitulares] = useState<OpcionesI[]>([]);
  const [titular, setTitular] = useState<string | number>("");

  const [alerta, setAlerta] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      const extraerDatos = async () => {
        try {
          const response = await getData<ResponseGetI>(
            "usuariosBancosRegistrados",
            null
          );
          const { status, data } = response;
          if (status === 200) {
            setTitulares(data.usuarios);
            setBancosRegistrados(data.bancos);
          }
        } catch (error: any) {
          if (error.response) {
            notifyError("Algo ha salido mal, verifique.", "top-center");
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
      extraerDatos();
    } else {
      setCarga(false);
      limpiarCampos();
    }
  }, [show]);

  const guardarCuenta = () => {
    if (
      clabe === "" ||
      clabe === null ||
      tarjeta === "" ||
      tarjeta === null ||
      banco === "" ||
      banco === null ||
      titular === "" ||
      titular === null
    ) {
      setAlerta(true);
      return null;
    }

    Swal.fire({
      title: "Verifique",
      text: "¿Está seguro que la información proporcionada es la correcta?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#05C7A7",
      confirmButtonText: "Sí, es correcto",
    }).then((result) => {
      if (result.isConfirmed) {
        const datos = { clabe, tarjeta, banco, titular };
        ejecutarGuardadoCuenta(datos);
      }
    });
  };

  const ejecutarGuardadoCuenta = async (datos: object) => {
    try {
      const response = await postData("guardarNuevaCuentaBancaria", datos);
      const { status } = response;
      if (status === 200) {
        actualizarCuentas();
        notifySuccess("¡Cuenta registrada!", "top-center");
        setTimeout(() => {
          handleClose();
        }, 250);
      }
    } catch (error: any) {
      if (error.response) {
        notifyError("No se pudo guardar, inténtelo más tarde.", "top-center");
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

  function limpiarCampos() {
    setClabe("");
    setTarjeta("");
    setBancosRegistrados([]);
    setBanco("");
    setTitulares([]);
    setTitular("");
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
            <span className="text-grey">{tituloModal} Cuenta</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            {carga ? (
              bancosRegistrados.length && titulares.length ? (
                <div className="w-100 expand-animation">
                  {/* CUENTA CLABE */}
                  <div>
                    <InputText
                      disabled={false}
                      placeHolder="Clabe"
                      tipoValor="numero"
                      valor={clabe}
                      onChange={(e) => {
                        setAlerta(false);
                        setClabe(e);
                      }}
                    />
                  </div>

                  {/* No TARJETA */}
                  <div className="mt-3">
                    <InputText
                      disabled={false}
                      placeHolder="Número de Tarjeta"
                      tipoValor="numero"
                      valor={tarjeta}
                      onChange={(e) => {
                        setAlerta(false);
                        setTarjeta(e);
                      }}
                    />
                  </div>

                  {/* BANCO */}
                  <div className="mt-3">
                    <SelectOption
                      disabled={false}
                      label="Banco"
                      opciones={bancosRegistrados}
                      seleccionado={banco}
                      onChange={(e) => {
                        setAlerta(false);
                        setBanco(e);
                      }}
                    />
                  </div>

                  {/* ASIGNAR USUARIO */}
                  <div className="mt-3">
                    <SelectOption
                      disabled={false}
                      label="Titular de cuenta"
                      opciones={titulares}
                      seleccionado={titular}
                      onChange={(e) => {
                        setAlerta(false);
                        setTitular(e);
                      }}
                    />
                  </div>

                  {alerta ? (
                    <div className="w-100 mt-3 t4 expand-animation">
                      <Alerta
                        clases="alerta-danger"
                        header="¡ERROR!"
                        body="Favor de llenar todos los campos."
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="w-100">
                  <p className="text-center m-0">
                    No hay usuarios y/o bancos registrados.
                  </p>
                </div>
              )
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
              guardarCuenta();
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
