
import { Usuario } from "./usuario";

export interface Notificacion {
  idNotificacion?: number;
  idUsuario: number;
  mensaje: string;
  fechaEnvio: string;
  usuario?: Usuario;
}
