import instance from "./axios";
import { AxiosResponse } from "axios";

const token = localStorage.getItem("key");
const headers = {
  Authorization: `Bearer ${token}`,
};

// Especificamos el tipo genérico para los métodos GET y POST
export const getData = async <T>(ruta: string, datos: object | FormData | null): Promise<AxiosResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await instance.get(`/${ruta}`, {
        params: datos,
        headers,
      });
      return response;
    } catch (error) {
      throw error as T; // Aquí también puedes manejar el error si es necesario
    }
  };
  
  export const postData = async <T>(ruta: string, datos: object | FormData | null): Promise<AxiosResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await instance.post(`/${ruta}`, datos, {
        headers,
      });
      return response;
    } catch (error) {
      throw error as T; // Aquí también puedes manejar el error si es necesario
    }
  };
