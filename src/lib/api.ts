import { toast } from "sonner";

// Define la URL base de la API (asegúrate de que termina en "/api/")
const API_URL = "http://localhost:5121/api/";

// Función de fetch con logging para ver el proceso
const fetchWithLogging = async (url: string, options?: RequestInit) => {
  console.log(`Fetching: ${url}`);
  try {
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${errorText}`);
      throw new Error(`Error: ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Tipos basados en tus tablas SQL
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

// Funciones genéricas para el manejo de la API
async function fetchData<T>(endpoint: string): Promise<T[]> {
  try {
    console.log(`Fetching data from ${API_URL}${endpoint}`);
    const data = await fetchWithLogging(`${API_URL}${endpoint}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    toast.error(`Error al cargar datos: ${(error as Error).message}`);
    return [];
  }
}

async function fetchById<T>(endpoint: string, id: number): Promise<T | null> {
  try {
    const data = await fetchWithLogging(`${API_URL}${endpoint}/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}/${id}:`, error);
    toast.error(`Error al cargar datos: ${(error as Error).message}`);
    return null;
  }
}

async function createData<T>(endpoint: string, data: T): Promise<T | null> {
  try {
    const responseData = await fetchWithLogging(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    toast.success("Registro creado exitosamente");
    return responseData;
  } catch (error) {
    console.error(`Failed to create ${endpoint}:`, error);
    toast.error(`Error al crear registro: ${(error as Error).message}`);
    return null;
  }
}

async function updateData<T>(endpoint: string, id: number, data: T): Promise<T | null> {
  try {
    const responseData = await fetchWithLogging(`${API_URL}${endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    toast.success("Registro actualizado exitosamente");
    return responseData;
  } catch (error) {
    console.error(`Failed to update ${endpoint}/${id}:`, error);
    toast.error(`Error al actualizar registro: ${(error as Error).message}`);
    return null;
  }
}

async function deleteData(endpoint: string, id: number): Promise<boolean> {
  try {
    await fetchWithLogging(`${API_URL}${endpoint}/${id}`, {
      method: "DELETE",
    });
    toast.success("Registro eliminado exitosamente");
    return true;
  } catch (error) {
    console.error(`Failed to delete ${endpoint}/${id}:`, error);
    toast.error(`Error al eliminar registro: ${(error as Error).message}`);
    return false;
  }
}

// Endpoints específicos para cada entidad, siguiendo la convención RESTful

export const empresasApi = {
  getAll: () => fetchData<Empresa>("EmpresaRecolectora/Lista"),
  getById: (id: number) => fetchById<Empresa>("EmpresaRecolectora", id),
  create: (empresa: Empresa) => createData<Empresa>("EmpresaRecolectora/Nuevo", empresa),
  update: (id: number, empresa: Empresa) => updateData<Empresa>("EmpresaRecolectora", id, empresa),
  delete: (id: number) => deleteData("EmpresaRecolectora", id),
};

export const localidadesApi = {
  getAll: () => fetchData<Localidad>("Localidad/Lista"),
  getById: (id: number) => fetchById<Localidad>("Localidad", id),
  create: (localidad: Localidad) => createData<Localidad>("Localidad/Nuevo", localidad),
  update: (id: number, localidad: Localidad) => updateData<Localidad>("Localidad", id, localidad),
  delete: (id: number) => deleteData("Localidad", id),
};

export const residuosApi = {
  getAll: () => fetchData<Residuo>("Residuo/Lista"),
  getById: (id: number) => fetchById<Residuo>("Residuo", id),
  create: (residuo: Residuo) => createData<Residuo>("Residuo/Nuevo", residuo),
  update: (id: number, residuo: Residuo) => updateData<Residuo>("Residuo", id, residuo),
  delete: (id: number) => deleteData("Residuo", id),
};

export const configuracionPuntosApi = {
  getAll: () => fetchData<ConfiguracionPuntos>("ConfiguracionPunto/Lista"),
  getById: (id: number) => fetchById<ConfiguracionPuntos>("ConfiguracionPunto", id),
  create: (config: ConfiguracionPuntos) => createData<ConfiguracionPuntos>("ConfiguracionPunto/Nuevo", config),
  update: (id: number, config: ConfiguracionPuntos) => updateData<ConfiguracionPuntos>("ConfiguracionPunto", id, config),
  delete: (id: number) => deleteData("ConfiguracionPunto", id),
};

export const usuariosApi = {
  getAll: () => fetchData<Usuario>("Usuario/Lista"),
  getById: (id: number) => fetchById<Usuario>("Usuario", id),
  create: (usuario: Usuario) => createData<Usuario>("Usuario/Nuevo", usuario),
  update: (id: number, usuario: Usuario) => updateData<Usuario>("Usuario", id, usuario),
  delete: (id: number) => deleteData("Usuario", id),
};

export const puntosUsuarioApi = {
  getAll: () => fetchData<PuntosUsuario>("PuntosUsuario/Lista"),
  getById: (id: number) => fetchById<PuntosUsuario>("PuntosUsuario", id),
  getByUsuario: (idUsuario: number) => fetchData<PuntosUsuario>(`PuntosUsuario/Usuario/${idUsuario}`),
  create: (puntos: PuntosUsuario) => createData<PuntosUsuario>("PuntosUsuario/Nuevo", puntos),
  update: (id: number, puntos: PuntosUsuario) => updateData<PuntosUsuario>("PuntosUsuario", id, puntos),
  delete: (id: number) => deleteData("PuntosUsuario", id),
};

export const notificacionesApi = {
  getAll: () => fetchData<Notificacion>("Notificacion/Lista"),
  getById: (id: number) => fetchById<Notificacion>("Notificacion", id),
  getByUsuario: (idUsuario: number) => fetchData<Notificacion>(`Notificacion/Usuario/${idUsuario}`),
  create: (notificacion: Notificacion) => createData<Notificacion>("Notificacion/Nuevo", notificacion),
  update: (id: number, notificacion: Notificacion) => updateData<Notificacion>("Notificacion", id, notificacion),
  delete: (id: number) => deleteData("Notificacion", id),
};

export const canjePuntosApi = {
  getAll: () => fetchData<CanjePuntos>("CanjePunto/Lista"),
  getById: (id: number) => fetchById<CanjePuntos>("CanjePunto", id),
  getByUsuario: (idUsuario: number) => fetchData<CanjePuntos>(`CanjePunto/Usuario/${idUsuario}`),
  create: (canje: CanjePuntos) => createData<CanjePuntos>("CanjePunto/Nuevo", canje),
  update: (id: number, canje: CanjePuntos) => updateData<CanjePuntos>("CanjePunto", id, canje),
  delete: (id: number) => deleteData("CanjePunto", id),
};

export const recoleccionesApi = {
  getAll: () => fetchData<Recoleccion>("Recolectar/Lista"),
  getById: (id: number) => fetchById<Recoleccion>("Recolectar", id),
  getByUsuario: (idUsuario: number) => fetchData<Recoleccion>(`Recolectar/Usuario/${idUsuario}`),
  create: (recoleccion: Recoleccion) => createData<Recoleccion>("Recolectar/Nuevo", recoleccion),
  update: (id: number, recoleccion: Recoleccion) => updateData<Recoleccion>("Recolectar", id, recoleccion),
  delete: (id: number) => deleteData("Recolectar", id),
};
