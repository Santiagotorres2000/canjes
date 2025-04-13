
import { Localidad } from "./localidad";

export interface Usuario {
  idUsuario?: number;
  idLocalidad?: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  email?: string;
  direccion?: string;
  rol: "Administrador" | "Usuario";
  localidad?: Localidad;
}
