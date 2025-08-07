import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
  return (
    <div className="w-100 container-home pt-4 pb-3">
      <section className="d-flex justify-content-center flex-column align-items-center">
        <h3>¿Quiénes somos?</h3>
        <hr className="separador mt-3 mb-0" />
        <div className="parrafo d-flex justify-content-center">
          <div className="py-4">
            <p className="m-0 t1">
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

      <section className="d-flex justify-content-center flex-column align-items-center">
        <h3>¿Cómo se eligen los ganadores?</h3>
        <hr className="separador mt-3 mb-0" />
        <div className="parrafo d-flex justify-content-center">
          <div className="py-4">
            <p className="m-0 t1">
              Los ganadores del premio se eligen a partir de la{" "}
              <a
                href="https://www.loterianacional.gob.mx/Home/"
                target="_blank"
              >
                Lotería Nacional Mexicana
              </a>
              . Todos los videos donde pueden visualizarse los sorteos y conocer qué boleto es el ganador (<b>premio mayor</b>), es en el canal de YouTube{" "}
              <a
                href="https://www.youtube.com/@LN__Tradicionales"
                target="_blank"
              >
                Lotería Nacional · Sorteos Tradicionales
              </a>
              , y serás el ganador siempre y cuando el número de boleto que hayas seleccionado, sea <b>igual</b> al boleto del premio mayor.
            </p>
          </div>
        </div>
      </section>

      <section className="d-flex justify-content-center flex-column align-items-center">
        <h3>¿Qué pasa si el ganador es un boleto no vendido?</h3>
        <hr className="separador mt-3 mb-0" />
        <div className="parrafo d-flex justify-content-center">
          <div className="py-4">
            <p className="m-0 t1">
              Se pospone para la siguiente rifa de la Lotería Nacional, no necesitas comprar otro boleto (aunque puedes hacerlo), ya que, el que hayas comprado anteriormente será útil para la siguiente rifa, por lo que tendrías el doble de posibilidades de llevarte el premio.
            </p>
          </div>
        </div>
      </section>

      <section className="d-flex justify-content-center flex-column align-items-center">
        <h3>¿Dónde ver los ganadores?</h3>
        <hr className="separador mt-3 mb-0" />
        <div className="parrafo d-flex justify-content-center">
          <div className="py-4">
            <p className="m-0 t1">
              Los ganadores pueden visualizarse desde la página de <a href="">Facebook</a> donde se harán directos en vivo.
              <br />
              Como se menciona en la pregunta "¿Cómo se eligen los ganadores?"
              la elección del ganador del producto en rifa, es mediante el boleto que hayas comprado y debe ser <b>igual</b> al del premio mayor de la Lotería Nacional Mexicana.
            </p>
          </div>
        </div>
      </section>

      <section className="d-flex justify-content-center flex-column align-items-center mt-4">
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
