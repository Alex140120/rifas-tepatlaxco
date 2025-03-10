import React from "react";

interface Props {
  contenido: any;
  clases: string;
  onClick: () => void;
}

export default function Boton({ contenido, clases, onClick }: Props) {
  return (
    <button className={`t3 rounded-1 ${clases}`} onClick={onClick}>
      {contenido}
    </button>
  );
}
