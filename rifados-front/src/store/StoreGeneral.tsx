import { create } from "zustand";

type Modulo = {
  modulo: string;
  setModulo: (modulo: string) => void;
};

export const ModuloGeneral = create<Modulo>((set) => ({
  modulo: "principal",
  setModulo: (nuevoModulo) => set({ modulo: nuevoModulo }),
}));
