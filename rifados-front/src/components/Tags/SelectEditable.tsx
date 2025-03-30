import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

interface OpcionesI {
    id: number | string;
    nombre: string;
}

interface Props {
    placeHolder: string;
    valorSeleccionado: null | OpcionesI;
    opcionesArray: OpcionesI[];
    cambiarValor: (value: null | OpcionesI) => void;
}

export default function SelectEditable({ placeHolder, valorSeleccionado, opcionesArray, cambiarValor } : Props) {

  return (
    <div>
      <Dropdown
        value={valorSeleccionado}
        onChange={(e: DropdownChangeEvent) => {
            cambiarValor(e.value);
        }}
        options={opcionesArray}
        optionLabel="nombre"
        editable={false}
        placeholder={placeHolder}
        className="w-full md:w-14rem w-100 border rounded-2 bg-bg-light"
      />
    </div>
  );
}
