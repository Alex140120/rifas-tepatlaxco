import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import "primereact/resources/themes/saga-green/theme.css";
//import "primereact/resources/themes/lara-dark-teal/theme.css";

interface ColumnasI {
  field: any;
  header: any;
}

interface Props {
  columnas: ColumnasI[];
  filas: Record<any, any>[];
  renderColumnContent: (field: string, rowData: any) => React.ReactNode;
}

export default function Tabla({ columnas, filas, renderColumnContent }: Props) {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredRows, setFilteredRows] = useState<Record<any, any>[]>(filas);

  // Filtra las filas cuando el texto de búsqueda cambie
  useEffect(() => {
    if (searchText === "") {
      setFilteredRows(filas); // Si no hay búsqueda, muestra todas las filas
    } else {
      const lowercasedSearchText = searchText.toLowerCase();
      const filtered = filas.filter((row) =>
        columnas.some((col) =>
          String(row[col.field]).toLowerCase().includes(lowercasedSearchText)
        )
      );
      setFilteredRows(filtered); // Actualiza las filas filtradas
    }
  }, [searchText, filas, columnas]);

  const header = (
    <div className="w-100">
      {/* BUSCADOR */}
      <div className="p-0">
        <div className="btn-group">
          <span className="mt-1 pr-1 border-bottom">
            <FontAwesomeIcon icon={faSearch} className="text-dark" />
          </span>
          <input
            type="text"
            placeholder="Buscar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="py-1 px-2 border-0 border-bottom shadow-none bg-transparent rounded-0 text-dark outline-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DataTable
        value={filteredRows} // Usa las filas filtradas
        tableStyle={{ minWidth: "50rem"}}
        scrollable
        scrollHeight="calc(100vh - 300px)"
        paginator
        rows={20}
        rowsPerPageOptions={[4, 10, 25, 50]}
        header={header}
        emptyMessage="No se encontraron resultados."
        className="t3 bg-info rounded-2"
      >
        {columnas.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            body={(rowData) => renderColumnContent(col.field, rowData)}
          />
        ))}
      </DataTable>
    </>
  );
}
