interface Props {
  clases: string;
  header: string;
  body: string;
}

export default function Alerta({ clases, header, body }: Props) {
  return (
    <div className={`w-100 p-2 ${clases}`}>
      <div id="header" className="mb-1 fw-bold">
        {header}
      </div>
      <div id="body" className="mb-1">
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
}
