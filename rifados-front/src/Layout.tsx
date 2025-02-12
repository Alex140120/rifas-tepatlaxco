import CarouselComponent from "./components/Carousel/CarouselComponent";
import NavBar from "./components/NavBar/NavBar";
import { Outlet } from "react-router-dom";

export default function Index() {
  return (
    <div className="">
      <NavBar />
      <div className="carousel w-100">
        <CarouselComponent />
      </div>
      <div>
        {/* COMPONENTES DINAMICOS */}
        <Outlet/>
      </div>
    </div>
  );
}
