interface Props {
  disabled: boolean;
  placeHolder: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export default function TextArea({
  disabled,
  placeHolder,
  valor,
  onChange,
  onBlur,
}: Props) {
  return (
    <div>
      <textarea
        disabled={disabled}
        placeholder={placeHolder}
        value={valor}
        className="w-100 border rounded-1 outline-none t2 text-grey p-2 bg-light"
        style={{ height: "120px" }}
        onChange={onChange}
        onBlur={onBlur}
      ></textarea>
    </div>
  );
}
