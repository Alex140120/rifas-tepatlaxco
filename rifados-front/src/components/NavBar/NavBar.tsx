import Icon from "/icon.webp";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    // Navegar sin cambiar la url en el historial
    navigate(path, { replace: true });
  };

  return (
    <nav className="nav">
      <input type="checkbox" id="nav-check" />
      <div className="nav-header d-flex align-items-center">
        <div className="nav-title w-100 d-flex align-items-center">
          <img src={Icon} width={45} />
          <h4 className="ms-2 mt-1 text-light">Rifados Tepatlaxco</h4>
        </div>
      </div>

      <div className="nav-btn">
        <label htmlFor="nav-check">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>

      <div className="nav-links">
        <div className="btns-acciones">
          <a
            className="rounded-3"
            style={{cursor: 'pointer'}}
            onClick={() => handleNavigation("/")}
          >
            Inicio
          </a>
          <a
            className="rounded-3"
            style={{cursor: 'pointer'}}
            onClick={() => handleNavigation("/rifas")}
          >
            Rifas
          </a>
          <a
            className="rounded-3"
            style={{cursor: 'pointer'}}
            onClick={() => handleNavigation("/metodosPago")}
          >
            Métodos de Pago
          </a>
        </div>
      </div>
    </nav>
  );
}
