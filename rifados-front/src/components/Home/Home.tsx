import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Iphone from "../../assets/img/iphone.jpg";
import Premio from "../../assets/img/premio.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
  return (
    <div className="w-100 container-home pt-4 pb-3">
      <section className="d-flex justify-content-center flex-column align-items-center border-bottom">
        <h3>¿Quiénes somos?</h3>
        <hr className="separador mt-3 mb-0" />
        <div className="parrafo py-4 d-flex align-items-center">
          <div className="flex-1 d-flex justify-content-center">
            <img src={Iphone} className="image-home rounded-circle" />
          </div>
          <div className="flex-2">
            <p className="m-0 text-justify">
              ¡Bienvenidos a Rifados Tepatlaxco! Somos un grupo de amigos que se
              dedica a organizar rifas de productos geniales a un{" "}
              <b>bajo precio</b> en cada boleto. Aquí encontrarás artículos de
              diferente tipo e índole, y garantizamos que todo es justo y
              transparente. <br />
              Lo mejor de todo es que en cada sorteo, ¡todos tienen la
              oportunidad de ganar algo increíble! <br />
              Únete a nosotros, ¡cada boleto es una oportunidad para brillar!
            </p>
          </div>
        </div>
      </section>

      <section className="d-flex justify-content-center flex-column align-items-center border-bottom mt-4">
        <h3>¿Cómo se eligen los ganadores?</h3>
        <hr className="separador mt-3 mb-0" />
        <div className="parrafo py-4 d-flex align-items-center">
          <div className="flex-1">
            <p className="m-0 text-justify">
              Seleccionamos a los ganadores de manera simple y clara. Cada
              participante recibe un número único al comprar un boleto, que se
              recopila en un sistema seguro. Durante un evento en vivo, usamos
              un generador de números aleatorios para asegurar que todos tengan
              la misma probabilidad de ganar. Transmitimos el sorteo en nuestras
              redes sociales para que todos puedan verlo en tiempo real. Una vez
              seleccionado el ganador, nos comunicamos de inmediato para
              entregar el premio. ¡Así todos disfrutan de la emoción del sorteo!
            </p>
          </div>
          <div className="flex-2 d-flex justify-content-center">
            <img src={Premio} className="image-home rounded-circle" />
          </div>
        </div>
      </section>
      
      <section className="d-flex justify-content-center flex-column align-items-center border-bottom mt-4">
        <h3>Contáctanos</h3>
        <hr className="separador mt-3 mb-0" />
        <div className="contacts d-flex w-100 justify-content-center align-items-center py-2">
          <a className="a-whatsapp me-4" href="https://wa.me/2214144701">
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
          <a
            className="a-facebook me-4"
            href="https://www.facebook.com/groups/5997053220396881"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a className="a-whatsapp me-4" href="https://wa.me/2213646439">
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
        </div>
      </section>
    </div>
  );
}
