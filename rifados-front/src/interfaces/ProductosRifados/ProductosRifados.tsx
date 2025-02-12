import { ToastContainer } from "react-toastify";
import TableData from "../../components/DataTable/TableData";

export default function ProductosRifados() {
  return (
    <div className="container-modulo px-3 py-2 rounded-3">
      <h2>Productos Rifados</h2>
      <hr />
      <div className="w-100 px-3">
        <TableData />
      </div>
      <ToastContainer />
    </div>
  );
}
