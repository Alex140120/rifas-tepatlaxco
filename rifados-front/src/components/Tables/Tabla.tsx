import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface ColumnasI {
  field: any;
  header: any;
}

interface Props {
  columnas: ColumnasI[];
  filas: Record<any, any>[];
  renderColumnContent: () => void;
}

export default function Tabla({ columnas, filas, renderColumnContent }: Props) {
  return (
    <>
      <DataTable value={filas} tableStyle={{ minWidth: "50rem" }}>
        {columnas.map((col) => (
          <Column key={col.field} field={col.field} header={col.header} />
        ))}
      </DataTable>
    </>
  );
}
