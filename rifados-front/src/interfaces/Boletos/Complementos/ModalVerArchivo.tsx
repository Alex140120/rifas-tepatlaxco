import { Modal } from "react-bootstrap";
import VisorArchivos from "../../../components/VisorDocumentos/VisorArchivos";

interface FilasI {
  id: number;
  boletos: string;
  nombre_comprador: string;
  numero_telefono: string;
  estado: string;
  localidad: string;
  calle_numero: string;
  codigo_postal: string;
  identificacion: string;
  idProducto: string;
  nombreProducto: string;
  pagoTotal: number;
  status: number;
  [key: string]: any; // Firma de índice añadida
}

interface Props {
  show: boolean;
  handleClose: () => void;
  cliente: FilasI | null;
}

export default function ModalVerArchivo({ show, handleClose, cliente }: Props) {
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
            <span className="text-grey">
              Identificación{" "}
              <span
                className="text-dark"
                style={{ textDecoration: "underline" }}
              >
                {cliente?.nombre_comprador ?? ""}
              </span>
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100 p-0">
            <VisorArchivos
              dominio="localhost:5173"
              nombreCarpeta="archivos"
              rutaArchivo={`../archivos/${cliente?.identificacion}`}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn-bancos rounded-4 mt-2 py-1 px-2 outline-none m-auto"
            onClick={() => {
              handleClose();
            }}
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
