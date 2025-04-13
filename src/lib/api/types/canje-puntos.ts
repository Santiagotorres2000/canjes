
import { Usuario } from "./usuario";

export interface CanjePuntos {
  idCanje?: number;
  idUsuario: number;
  puntosUsados: number;
  tienda: string;
  fechaCanje?: string;
  usuario?: Usuario;
}
