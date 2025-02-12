interface Props {
  disabled: boolean;
  placeHolder: string;
  valor: string | number;
  tipoValor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function InputText({
  disabled,
  placeHolder,
  valor,
  tipoValor,
  onChange,
  onBlur,
}: Props) {
  function verificarValor(valor: any) {
    if (tipoValor === "numero") {
      if (isNaN(valor)) {
        return "";
      }
      return valor;
    }
    return valor;
  }

  return (
    <div>
      <input
        disabled={disabled}
        placeholder={placeHolder}
        value={valor}
        type="text"
        id="nombre"
        name="nombre"
        className="w-100 p-2 t2 text-grey border rounded-1 bg-light"
        onChange={(e) => {
          const valor = verificarValor(e.target.value);
          onChange(valor);
        }}
        onBlur={onBlur}
      />
    </div>
  );
}
