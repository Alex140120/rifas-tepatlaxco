import Carousel from "react-bootstrap/Carousel";
import MercadoPago from "../../assets/img/mercadopago.png";
import BancoAzteca from "../../assets/img/bancoazteca.png";
import HSBC from "../../assets/img/hsbc.jpg";
import NU from "../../assets/img/nu.jpg";

import MetodoPago from "../ModalMetodosPago/MetodoPago";
import { useState } from "react";

function CarouselComponent() {
  const [show, setShow] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [tipoBanco, setTipoBanco] = useState<number>(0);

  return (
    <div>
      <Carousel slide={true} className="p-0 container-pagos">
        <Carousel.Item className="px-0 py-3 pt-2">
          <div className="carusel-img-content m-auto pb-0">
            <div className="banco-2 d-flex justify-content-center align-items-center flex-column">
              <img src={BancoAzteca} className="img-carusel" />
              <button
                className="btn-bancos rounded-4 mt-2 py-1 px-2 outline-none"
                onClick={() => {
                  handleShow();
                  setTipoBanco(1);
                }}
              >
                Ver Información...
              </button>
            </div>

            <div className="banco-2 d-flex justify-content-center align-items-center flex-column">
              <img src={NU} className="img-carusel" />
              <button
                className="btn-bancos rounded-4 mt-2 py-1 px-2 outline-none"
                onClick={() => {
                  handleShow();
                  setTipoBanco(2);
                }}
              >
                Ver Información...
              </button>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item className="px-0 py-3 pt-2">
          <div className="carusel-img-content m-auto pb-0">
            <div className="banco-1 d-flex justify-content-center align-items-center flex-column">
              <img src={HSBC} className="img-carusel" />
              <button
                className="btn-bancos rounded-4 mt-2 py-1 px-2 outline-none"
                onClick={() => {
                  handleShow();
                  setTipoBanco(3);
                }}
              >
                Ver Información...
              </button>
            </div>

            <div className="banco-1 d-flex justify-content-center align-items-center flex-column">
              <img src={MercadoPago} className="img-carusel" />
              <button
                className="btn-bancos rounded-4 mt-2 py-1 px-2 outline-none"
                onClick={() => {
                  handleShow();
                  setTipoBanco(4);
                }}
              >
                Ver Información...
              </button>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      <MetodoPago show={show} handleClose={handleClose} tipoBanco={tipoBanco} />
    </div>
  );
}

export default CarouselComponent;
