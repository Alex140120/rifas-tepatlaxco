import Carousel from "react-bootstrap/Carousel";
import { useEffect, useState } from "react";
import { getData } from "../../api/apiRequest";
import Spinner from "../Tags/Spinner";
import ModalUsuariosBanco from "../Modales/ModalUsuariosBanco";

interface FilasI {
  id: number;
  nombre_banco: string;
  logo_banco: string;
  cuentas: number;
  [key: string]: any; // Firma de índice añadida
}

interface ResponseI {
  bancos: FilasI[];
}

interface BancoI {
  id: number;
  nombre_banco: string;
  logo_banco: string;
}

function CarouselComponent() {
  const [show, setShow] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [datosBanco, setDatosBanco] = useState<BancoI | null>(null);

  const [bancos, setBancos] = useState<FilasI[]>([]);

  const [loading, setLoading] = useState(false);

  // Bancos Registrados
  useEffect(() => {
    const extraerBancosRegistrados = async () => {
      try {
        const response = await getData<ResponseI>(
          "bancosRegistradosCliente",
          null
        );
        const { status, data } = response;
        if (status === 200) {
          //console.log(data);
          setBancos(data.bancos);
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
        setLoading(true);
      }
    };
    extraerBancosRegistrados();
  }, []);

  // Agrupar los avisos en grupos de 2 para cada diapositiva
  const grupoBancos = [];
  for (let i = 0; i < bancos.length; i += 2) {
    grupoBancos.push(bancos.slice(i, i + 2));
  }

  return (
    <div>
      {loading ? (
        <Carousel slide={true} className="p-0 container-pagos">
          {grupoBancos.length
            ? grupoBancos.map((grupo, index) => (
                <Carousel.Item key={index} className="px-0 py-3 pt-2">
                  <div className="carusel-img-content m-auto pb-0">
                    {grupo.map((slide, slideIndex) => (
                      <div
                        key={slideIndex}
                        className="banco-2 d-flex justify-content-center align-items-center flex-column"
                      >
                        <img src={slide.logo_banco} className="img-carusel" />
                        <button
                          className="btn-bancos rounded-4 mt-2 py-1 px-2 outline-none"
                          onClick={() => {
                            handleShow();
                            setDatosBanco(slide);
                          }}
                        >
                          Ver Información...
                        </button>
                      </div>
                    ))}
                  </div>
                </Carousel.Item>
              ))
            : null}
        </Carousel>
      ) : (
        <div className="w-100 text-center">
          <Spinner />
        </div>
      )}

      <ModalUsuariosBanco
        show={show}
        handleClose={handleClose}
        datos={datosBanco}
      />
    </div>
  );
}

export default CarouselComponent;
