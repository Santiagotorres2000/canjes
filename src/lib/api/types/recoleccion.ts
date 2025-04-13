
import { Usuario } from "./usuario";
import { Empresa } from "./empresa";
import { Residuo } from "./residuo";

export interface Recoleccion {
  idRecoleccion?: number;
  idUsuario: number;
  idEmpresa: number;
  idResiduo: number;
  fechaRecoleccion: string;
  pesoKg: number;
  estado: "Programada" | "Completada" | "Cancelada";
  usuario?: Usuario;
  empresa?: Empresa;
  residuo?: Residuo;
}
