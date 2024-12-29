import MercadoPago from "../../assets/img/mercadopago.png";
import BancoAzteca from "../../assets/img/bancoazteca.png";
import HSBC from "../../assets/img/hsbc.jpg";
import NU from "../../assets/img/nu.jpg";

export default function ModalMetodosdePago() {
  return (
    <div>
      <div className="w-100">
        <div className="row m-0 rounded-3 p-2 datos-banco mb-3 py-2">
          <div className="col-lg-2 col-md-12 col-xs-12 border-end d-flex align-items-center justify-content-center">
            <img src={HSBC} className="img-carusel rounded-2" />
          </div>
          <div className="col-lg-10 col-md-12 col-xs-12 mt-2">
            <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">Nombre:</p>
              <p className="m-0 w-75">Nombre del titular de la cuenta</p>
            </div>
            <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">Clabe:</p>
              <p className="m-0 w-75">12542154787</p>
            </div>
            <div className="d-flex" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">No. Tarjeta:</p>
              <p className="m-0 w-75">12457845</p>
            </div>
          </div>
        </div>

        <div className="row m-0 rounded-3 p-2 datos-banco mb-3 py-2">
          <div className="col-lg-2 col-md-12 col-xs-12 border-end d-flex align-items-center justify-content-center">
            <img src={BancoAzteca} className="img-carusel rounded-2" />
          </div>
          <div className="col-lg-10 col-md-12 col-xs-12 mt-2">
            <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">Nombre:</p>
              <p className="m-0 w-75">Nombre del titular de la cuenta</p>
            </div>
            <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">Clabe:</p>
              <p className="m-0 w-75">12542154787</p>
            </div>
            <div className="d-flex" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">No. Tarjeta:</p>
              <p className="m-0 w-75">12457845</p>
            </div>
          </div>
        </div>

        <div className="row m-0 rounded-3 p-2 datos-banco mb-3 py-2">
          <div className="col-lg-2 col-md-12 col-xs-12 border-end d-flex align-items-center justify-content-center">
            <img src={MercadoPago} className="img-carusel rounded-2" />
          </div>
          <div className="col-lg-10 col-md-12 col-xs-12 mt-2">
            <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">Nombre:</p>
              <p className="m-0 w-75">Nombre del titular de la cuenta</p>
            </div>
            <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">Clabe:</p>
              <p className="m-0 w-75">12542154787</p>
            </div>
            <div className="d-flex" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">No. Tarjeta:</p>
              <p className="m-0 w-75">12457845</p>
            </div>
          </div>
        </div>

        <div className="row m-0 rounded-3 p-2 datos-banco mb-3 py-2">
          <div className="col-lg-2 col-md-12 col-xs-12 border-end d-flex align-items-center justify-content-center">
            <img src={NU} className="img-carusel rounded-2" />
          </div>
          <div className="col-lg-10 col-md-12 col-xs-12 mt-2">
            <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">Nombre:</p>
              <p className="m-0 w-75">Nombre del titular de la cuenta</p>
            </div>
            <div className="d-flex mb-1" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">Clabe:</p>
              <p className="m-0 w-75">12542154787</p>
            </div>
            <div className="d-flex" style={{ fontSize: "15px" }}>
              <p className="m-0 w-25">No. Tarjeta:</p>
              <p className="m-0 w-75">12457845</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
