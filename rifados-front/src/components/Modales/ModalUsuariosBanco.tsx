import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { getData } from "../../api/apiRequest";
import { CuentasBancariasI } from "../../constants/Interfaces-ts";
import Spinner from "../Tags/Spinner";

interface BancoI {
  id: number;
  nombre_banco: string;
  logo_banco: string;
}

interface ResponseBancoI {
  cuentas: CuentasBancariasI[];
}

interface Props {
  show: boolean;
  handleClose: () => void;
  datos: BancoI | null;
}

export default function ModalUsuariosBanco({
  show,
  handleClose,
  datos,
}: Props) {
  const [carga, setCarga] = useState<boolean>(false);

  const [cuentasBancarias, setCuentasBancarias] = useState<CuentasBancariasI[]>(
    []
  );

  useEffect(() => {
    if (show) {
      if (datos !== null && Object.keys(datos).length) {
        extraerUsuarioBanco(datos.id);
      }
    } else {
      setCarga(false);
      setCuentasBancarias([]);
    }
  }, [show, datos]);

  const extraerUsuarioBanco = async (id: number) => {
    try {
      const response = await getData<ResponseBancoI>(
        "usuariosBancoSeleccionado",
        { id }
      );
      const { status, data } = response;
      if (status === 200) {
        //console.log(data);
        setCuentasBancarias(data.cuentas);
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
            <div className="w-100 d-flex justify-content-start align-items-center">
              <img
                src={datos?.logo_banco ?? ""}
                alt="Logo Banco"
                className="rounded-2"
                width={70}
              />
              <span className="text-grey mt-2 ms-2">
                {datos?.nombre_banco ?? ""}
              </span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
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
              <div className="w-100 text-center py-2">
                <Spinner />
              </div>
            )}
          </>
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
