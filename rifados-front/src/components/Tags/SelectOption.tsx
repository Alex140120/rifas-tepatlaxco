interface OpcionesI {
  id: number | string;
  opcion: string | number;
  disabled: boolean;
}

interface Props {
  disabled: boolean;
  label: string;
  opciones: OpcionesI[];
  seleccionado: number | string;
  onChange: (valor: string | number) => void;
}

export default function SelectOption({
  label,
  opciones,
  seleccionado,
  onChange,
  disabled,
}: Props) {
  return (
    <>
      <select
        className="w-100 border text-grey p-2 rounded-1 bg-light t3"
        disabled={disabled}
        value={seleccionado}
        onChange={(e) => {
          const valor = e.target.value;
          onChange(valor);
        }}
      >
        <option value="">{label}</option>
        {opciones
          ? opciones.map((row, index) => (
              <option key={index} value={row.id} disabled={row.disabled}>
                {row.opcion}
              </option>
            ))
          : null}
      </select>
    </>
  );
}
