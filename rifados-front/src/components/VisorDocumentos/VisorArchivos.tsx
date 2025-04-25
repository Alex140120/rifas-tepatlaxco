import { useEffect, useState } from "react";

interface Props {
  dominio: string;
  rutaArchivo: string;
  nombreCarpeta: string;
}

export default function VisorArchivos({
  dominio,
  rutaArchivo,
  nombreCarpeta,
}: Props) {
  const [visorRender, setVisorRender] = useState<JSX.Element>(<></>);

  useEffect(() => {
    if (rutaArchivo !== "" && rutaArchivo !== null) {
      const nombreArchivo = Basename(rutaArchivo);
      const urlCompleta = `${dominio}/${nombreCarpeta}/${nombreArchivo}`;

      const tiposDocumentosOffice = [
        ".docx",
        ".xlsx",
        ".pptx",
        ".doc",
        ".xls",
        ".ppt",
      ];

      const tiposImagenes = [".jpg", ".png", ".jpeg"];

      const tipoPDF = [".pdf"];

      const esDocumentoOffice = tiposDocumentosOffice.some((ext) =>
        nombreArchivo?.endsWith(ext)
      );

      const esImagen = tiposImagenes.some((ext) =>
        nombreArchivo?.endsWith(ext)
      );

      const esPDF = tipoPDF.some((ext) => nombreArchivo?.endsWith(ext));

      if (esDocumentoOffice) {
        setVisorRender(
          <div className="w-100 expand-animation">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${urlCompleta}`}
              className="visor-office"
            ></iframe>
          </div>
        );
      } else if (esImagen) {
        setVisorRender(
          <div className="w-100 expand-animation">
            <img src={rutaArchivo} className="w-100 border-1 rounded-2" />
          </div>
        );
      } else if (esPDF) {
        setVisorRender(
          <div className="w-100 expand-animation">
            <iframe
              src={`https://${urlCompleta}`} 
              className="visor-office"
            ></iframe>
          </div>
        );
      }
    }
  }, [rutaArchivo]); 
 
  function Basename(pathArchivo: string) {
    // URL dummy para permitir que URL.parse funcione
    const url = new URL(pathArchivo, "http://dummy.com");
    return url.pathname.split("/").pop();
  }

  return <div>{visorRender}</div>;
}
