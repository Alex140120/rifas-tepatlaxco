import { ModuloGeneral } from "../store/StoreGeneral";

export const ActualizarMain = (nuevoModulo: string) => {
  const setModulo = ModuloGeneral.getState().setModulo;
  setModulo(nuevoModulo);
};
