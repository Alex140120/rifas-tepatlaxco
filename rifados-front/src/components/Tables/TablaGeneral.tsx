import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  faFileExcel,
  faFilePdf,
  faSearch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "primereact/checkbox";

interface Props {
  columnas: [];
  filas: [];
  renderColumnContent: () => void;
  nombreArchivo: string;
}

export default function TablaGeneral({
  columnas,
  filas,
  renderColumnContent,
  nombreArchivo,
}: Props) {
  const [products, setProducts] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(1);
  const [searchText, setSearchText] = useState(""); // Nuevo estado para el texto de búsqueda
  const [disabled, setDisabled] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isTrue, setIsTrue] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);

  //guardara que columnas se mostraran
  const [visibleColumns, setVisibleColumns] = useState(columnas);

  //exporta el archivo de excel
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const exportableColumns = visibleColumns.filter((item) => item.exportable != false);

      const selectedColumns = exportableColumns.map((col) => col.header);
      const selectedColumns1 = exportableColumns.map((col) => col.field);

      const worksheetData = products.map((product) => {
        const rowData = selectedColumns1.map((header) => product[header]);
        return rowData;
      });

      const worksheet = xlsx.utils.aoa_to_sheet([
        selectedColumns,
        ...worksheetData,
      ]);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAs(
        new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }),
        nombreArchivo + ".xlsx"
      );
    });
  };

  //exporta el pdf
  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        // exportar aquellas permitidas
        const exportableColumns = visibleColumns.filter((item) => item.exportable != false);

        // Obtén los nombres de las columnas visibles
        const selectedColumns = exportableColumns.map((col) => col.header);
        const selectedColumns1 = exportableColumns.map((col) => col.field);

        // Mapea los datos para que coincidan con las columnas visibles
        const data1 = products.map((product) => {
          return selectedColumns1.map((col) => product[col]);
        });

        // Configura la orientación en función del número de columnas
        const orientation =
          selectedColumns.length > 6 ? "landscape" : "portrait";
        // Crea el documento PDF con la orientación adecuada
        const doc = new jsPDF.default({ orientation });

        // Crear la tabla en el documento PDF
        doc.autoTable({
          head: [selectedColumns], // Utiliza un array para los títulos de las columnas
          body: data1, // Los datos deben ser un array de arrays
          styles: {
            // Aplica el estilo para centrar el texto horizontalmente y verticalmente
            cellPadding: 5,
            halign: "left",
            valign: "middle",
            fontSize: 6.8,
          },
        });

        // Guarda el documento PDF
        doc.save(nombreArchivo + ".pdf");
      });
    });
  };

  //actualiza el check
  function updateCheck(check) {
    setDisabled(true); //agregara d-none a el check y el span que sigue despues del check
    if (check == true) {
      setDisabledBtn(true);
      setTablaCompleta(check); //actualiza el dato de zustand
    }
    setChecked(check); //activa el check
  }

  const header = (
    <div className="w-100 d-flex align-items-center justify-content-between">
      <div className="d-flex justify-content-start align-items-center">
        {/* FILTROS */}
        <div className="mr-1 pe-2 opciones-tabla d-flex align-items-center">
          <span>
            <OverlayTrigger
              placement="left"
              overlay={
                <Tooltip>
                  Haga clic en la flecha desplegable para cambiar la visbilidad
                  de la columna.
                </Tooltip>
              }
            >
              <button className="border-0 bg-transparent p-0">
                <MultiSelect
                  value={visibleColumns}
                  options={columnas}
                  optionLabel="header"
                  onChange={(e) => setVisibleColumns(e.value)}
                  className="mr-1 filtro_columna shadow-none border-0 mt-2 bg-transparent"
                  display="chip"
                />
              </button>
            </OverlayTrigger>
          </span>
        </div>
      </div>
      {/* BUSCADOR */}
      <div className="p-0 border-start ps-3">
        <div className="btn-group grupo-icon-buscar">
          <span className="mt-1 pr-1 icon-search border-bottom">
            <FontAwesomeIcon icon={faSearch} className="text-light" />
          </span>
          <input
            type="text"
            placeholder="Buscar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="p-1 border-0 border-bottom shadow-none bg-transparent rounded-0 text-light outline-none"
          />
        </div>
      </div>
    </div>
  );

  // Filtrar los productos en función del texto de búsqueda
  const filteredProducts = products.filter((product) => {
    return visibleColumns.some((col) => {
      const fieldValue = product[col.field];
      return (
        fieldValue &&
        fieldValue.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    });
  });

  return (
    <div className="card rounded-0 ">
      {/* Utiliza los productos filtrados y ordenados en lugar de los originales */}
      <DataTable
        className="centrar-columnas"
        scrollable
        scrollHeight="calc(100vh - 300px)" // Ajusta la altura como prefieras
        style={{ width: "100%" }} // Cambia el ancho al 100% para que se ajuste al contenedor
        paginator
        rows={20}
        rowsPerPageOptions={[5, 10, 25, 50]}
        value={filteredProducts}
        header={header}
        tableStyle={{ width: "100%" }} // Ajusta el ancho al 100% para que se ajuste al contenedor
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(e) => {
          setSortField(e.sortField);
          setSortOrder(e.sortOrder);
        }}
      >
        <Column
          field="id"
          header="No"
          sortable={false}
          style={{ textAlign: "center", background: "white", color: "#555" }}
          body={(rowData, { rowIndex }) => rowIndex + 1}
          exportable={true}
        />
        {visibleColumns.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={col.header}
            style={{
              width: col.width,
              textAlign: "center",
              background: "white",
              color: "#555",
            }}
            sortable={col.sortable}
            body={(rowData) => renderColumnContent(col.field, rowData)}
            exportable={col.exportable}
          />
        ))}
      </DataTable>
    </div>
  );
}
