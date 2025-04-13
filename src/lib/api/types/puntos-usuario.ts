
import { Usuario } from "./usuario";

export interface PuntosUsuario {
  idPuntos?: number;
  idUsuario: number;
  puntos: number;
  fechaObtencion: string;
  estado: "Acumulado" | "Canjeado";
  usuario?: Usuario;
}
