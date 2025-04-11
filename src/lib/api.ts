import { toast } from "sonner";

const API_URL = "http://localhost:5121/api/";

// Types based on your SQL tables
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

// Generic API functions
async function fetchData<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    toast.error(`Error al cargar datos: ${(error as Error).message}`);
    return [];
  }
}

async function fetchById<T>(endpoint: string, id: number): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${endpoint}/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching ${endpoint}/${id}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}/${id}:`, error);
    toast.error(`Error al cargar datos: ${(error as Error).message}`);
    return null;
  }
}

async function createData<T>(endpoint: string, data: T): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error creating ${endpoint}: ${response.statusText}`);
    }
    toast.success("Registro creado exitosamente");
    return await response.json();
  } catch (error) {
    console.error(`Failed to create ${endpoint}:`, error);
    toast.error(`Error al crear registro: ${(error as Error).message}`);
    return null;
  }
}

async function updateData<T>(endpoint: string, id: number, data: T): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error updating ${endpoint}/${id}: ${response.statusText}`);
    }
    toast.success("Registro actualizado exitosamente");
    return await response.json();
  } catch (error) {
    console.error(`Failed to update ${endpoint}/${id}:`, error);
    toast.error(`Error al actualizar registro: ${(error as Error).message}`);
    return null;
  }
}

async function deleteData(endpoint: string, id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}${endpoint}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error deleting ${endpoint}/${id}: ${response.statusText}`);
    }
    toast.success("Registro eliminado exitosamente");
    return true;
  } catch (error) {
    console.error(`Failed to delete ${endpoint}/${id}:`, error);
    toast.error(`Error al eliminar registro: ${(error as Error).message}`);
    return false;
  }
}

// Specific API functions for each entity
export const empresasApi = {
  getAll: () => fetchData<Empresa>("empresas"),
  getById: (id: number) => fetchById<Empresa>("empresas", id),
  create: (empresa: Empresa) => createData<Empresa>("empresas", empresa),
  update: (id: number, empresa: Empresa) => updateData<Empresa>("empresas", id, empresa),
  delete: (id: number) => deleteData("empresas", id),
};

export const localidadesApi = {
  getAll: () => fetchData<Localidad>("localidades"),
  getById: (id: number) => fetchById<Localidad>("localidades", id),
  create: (localidad: Localidad) => createData<Localidad>("localidades", localidad),
  update: (id: number, localidad: Localidad) => updateData<Localidad>("localidades", id, localidad),
  delete: (id: number) => deleteData("localidades", id),
};

export const residuosApi = {
  getAll: () => fetchData<Residuo>("residuos"),
  getById: (id: number) => fetchById<Residuo>("residuos", id),
  create: (residuo: Residuo) => createData<Residuo>("residuos", residuo),
  update: (id: number, residuo: Residuo) => updateData<Residuo>("residuos", id, residuo),
  delete: (id: number) => deleteData("residuos", id),
};

export const configuracionPuntosApi = {
  getAll: () => fetchData<ConfiguracionPuntos>("configuracionpuntos"),
  getById: (id: number) => fetchById<ConfiguracionPuntos>("configuracionpuntos", id),
  create: (config: ConfiguracionPuntos) => createData<ConfiguracionPuntos>("configuracionpuntos", config),
  update: (id: number, config: ConfiguracionPuntos) => updateData<ConfiguracionPuntos>("configuracionpuntos", id, config),
  delete: (id: number) => deleteData("configuracionpuntos", id),
};

export const usuariosApi = {
  getAll: () => fetchData<Usuario>("usuarios"),
  getById: (id: number) => fetchById<Usuario>("usuarios", id),
  create: (usuario: Usuario) => createData<Usuario>("usuarios", usuario),
  update: (id: number, usuario: Usuario) => updateData<Usuario>("usuarios", id, usuario),
  delete: (id: number) => deleteData("usuarios", id),
};

export const puntosUsuarioApi = {
  getAll: () => fetchData<PuntosUsuario>("puntosusuarios"),
  getById: (id: number) => fetchById<PuntosUsuario>("puntosusuarios", id),
  getByUsuario: (idUsuario: number) => fetchData<PuntosUsuario>(`puntosusuarios/usuario/${idUsuario}`),
  create: (puntos: PuntosUsuario) => createData<PuntosUsuario>("puntosusuarios", puntos),
  update: (id: number, puntos: PuntosUsuario) => updateData<PuntosUsuario>("puntosusuarios", id, puntos),
  delete: (id: number) => deleteData("puntosusuarios", id),
};

export const notificacionesApi = {
  getAll: () => fetchData<Notificacion>("notificaciones"),
  getById: (id: number) => fetchById<Notificacion>("notificaciones", id),
  getByUsuario: (idUsuario: number) => fetchData<Notificacion>(`notificaciones/usuario/${idUsuario}`),
  create: (notificacion: Notificacion) => createData<Notificacion>("notificaciones", notificacion),
  update: (id: number, notificacion: Notificacion) => updateData<Notificacion>("notificaciones", id, notificacion),
  delete: (id: number) => deleteData("notificaciones", id),
};

export const canjePuntosApi = {
  getAll: () => fetchData<CanjePuntos>("canjepuntos"),
  getById: (id: number) => fetchById<CanjePuntos>("canjepuntos", id),
  getByUsuario: (idUsuario: number) => fetchData<CanjePuntos>(`canjepuntos/usuario/${idUsuario}`),
  create: (canje: CanjePuntos) => createData<CanjePuntos>("canjepuntos", canje),
  update: (id: number, canje: CanjePuntos) => updateData<CanjePuntos>("canjepuntos", id, canje),
  delete: (id: number) => deleteData("canjepuntos", id),
};

export const recoleccionesApi = {
  getAll: () => fetchData<Recoleccion>("recolecciones"),
  getById: (id: number) => fetchById<Recoleccion>("recolecciones", id),
  getByUsuario: (idUsuario: number) => fetchData<Recoleccion>(`recolecciones/usuario/${idUsuario}`),
  create: (recoleccion: Recoleccion) => createData<Recoleccion>("recolecciones", recoleccion),
  update: (id: number, recoleccion: Recoleccion) => updateData<Recoleccion>("recolecciones", id, recoleccion),
  delete: (id: number) => deleteData("recolecciones", id),
};
