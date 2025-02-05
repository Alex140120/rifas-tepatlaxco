interface Props {
  disabled: boolean;
  placeHolder: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function InputText({
  disabled,
  placeHolder,
  valor,
  onChange,
  onBlur,
}: Props) {
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
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}
