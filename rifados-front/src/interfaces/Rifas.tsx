import { Carousel } from "react-bootstrap";

import Iphone0 from "../../public/productos/iphone0.jpg";
import Iphone1 from "../../public/productos/iphone1.jpg"; // Asegúrate de usar imágenes diferentes
import Boletos from "./Rifas/Boletos";

export default function Rifas() {
  return (
    <>
      <div className="w-100 p-0 m-0 bg-dark">
        <Carousel interval={2500}>
          <Carousel.Item>
            <div className="carousel-image-container">
              <img className="d-block img-product-carousel" src={Iphone0} />
              <div className="overlay" />
              <Carousel.Caption>
                <h1>IPhone 13 Pro</h1>
                <div className="m-auto text-justify">
                  <p className="text-light translucent-black">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Laborum ipsum accusantium repellat quis vitae neque
                    laudantium voluptatibus ducimus delectus a, id dolore velit
                    odit tempore obcaecati ex? Harum, libero ducimus!
                  </p>
                </div>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="carousel-image-container">
              <img className="d-block img-product-carousel" src={Iphone1} />
              <div className="overlay" />
              <Carousel.Caption>
                <h1>IPhone 13 Pro</h1>
                <div className="m-auto text-justify">
                  <p className="text-light translucent-black">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Laborum ipsum accusantium repellat quis vitae neque
                    laudantium voluptatibus ducimus delectus a, id dolore velit
                    odit tempore obcaecati ex? Harum, libero ducimus!
                  </p>
                </div>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
      <Boletos/>
    </>
  );
}
