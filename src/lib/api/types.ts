
// Common types for the API

// Base API URL and fetch with logging
export const API_URL = "http://localhost:5121/api/";

// Entity interfaces
export interface Empresa {
  idEmpresa?: number;
  nombre: string;
  tipoResiduo: string;
}

export interface Localidad {
  idLocalidad?: number;
  nombre: string;
}

export interface Residuo {
  idResiduo?: number;
  tipoResiduo: "Orgánico" | "Inorgánico Reciclable" | "Peligroso";
}

export interface ConfiguracionPuntos {
  idConfiguracion?: number;
  factorConversion: number;
  ultimaActualizacion?: string;
}

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

export interface PuntosUsuario {
  idPuntos?: number;
  idUsuario: number;
  puntos: number;
  fechaObtencion: string;
  estado: "Acumulado" | "Canjeado";
  usuario?: Usuario;
}

export interface Notificacion {
  idNotificacion?: number;
  idUsuario: number;
  mensaje: string;
  fechaEnvio: string;
  usuario?: Usuario;
}

export interface CanjePuntos {
  idCanje?: number;
  idUsuario: number;
  puntosUsados: number;
  tienda: string;
  fechaCanje?: string;
  usuario?: Usuario;
}

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
