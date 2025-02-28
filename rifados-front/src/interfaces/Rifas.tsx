import { Carousel } from "react-bootstrap";

import Boletos from "./Rifas/Boletos";
import { useEffect, useState } from "react";
import { getData } from "../api/apiRequest";
import Spinner from "../components/Tags/Spinner";

interface ImagenesI {
  ruta: string;
  nombrearchivo: string;
}

interface DatosProductoI {
  id: number;
  nombre: string;
  descripcion: string;
  boletos: number;
  imagenes: ImagenesI[];
}

interface ProductoResponseI {
  producto: DatosProductoI;
}

export default function Rifas() {
  const [carga, setCarga] = useState<boolean>(false);

  const [idProducto, setIdProducto] = useState<number | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [imagenes, setImagenes] = useState<ImagenesI[]>([]);

  useEffect(() => {
    extraerProductoRifado();
  }, []);

  const extraerProductoRifado = async () => {
    try {
      const response = await getData<ProductoResponseI>(
        "extraerProductoRifado",
        null
      );
      const { status, data } = response;
      console.log(status);
      console.log(data);
      if (status === 204) {
      }
      if (status === 200) {
        setIdProducto(data.producto.id);
        setNombre(data.producto.nombre);
        setDescripcion(data.producto.descripcion);
        setImagenes(data.producto.imagenes);
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
    <>
      <div>
        {carga ? (
          <div className="p-0 m-0 bg-light expand-animation m-auto">
            {imagenes.length ? (
              <Carousel interval={2500}>
                {imagenes.map((item, index) => (
                  <Carousel.Item key={index}>
                    <div className="carousel-image-container">
                      <img
                        className="d-block img-product-carousel"
                        src={item.ruta}
                      />
                      <div className="overlay" />
                      <Carousel.Caption>
                        <h1>{nombre}</h1>
                        <div className="m-auto text-justify">
                          <p className="text-light translucent-black t3">
                            {descripcion}
                          </p>
                        </div>
                      </Carousel.Caption>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : null}
          </div>
        ) : (
          <div className="text-center w-100 pt-3 pb-2">
            <Spinner />
          </div>
        )}
      </div>
      <Boletos />
    </>
  );
}
