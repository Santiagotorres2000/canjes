import { toast } from "sonner";
import { API_URL } from "./types";

// Función de fetch con logging para ver el proceso
export const fetchWithLogging = async (url: string, options?: RequestInit) => {
  console.log(`Fetching: ${url}`);
  try {
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${errorText}`);
      throw new Error(`Error: ${response.statusText} - ${errorText}`);
    }
    
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      data = await response.text();
      try {
        // Try to parse as JSON anyway in case the content-type header is wrong
        data = JSON.parse(data);
      } catch (e) {
        // It's not JSON, keep as text
      }
    }
    
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Funciones genéricas para el manejo de la API
export async function fetchData<T>(endpoint: string): Promise<T[]> {
  try {
    console.log(`Fetching data from ${API_URL}${endpoint}`);
    const data = await fetchWithLogging(`${API_URL}${endpoint}`);
    
    if (!data) {
      console.warn(`No data returned from ${endpoint}`);
      return [];
    }
    
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    toast.error(`Error al cargar datos: ${(error as Error).message}`);
    return [];
  }
}

export async function fetchById<T>(endpoint: string, id: number): Promise<T | null> {
  try {
    const data = await fetchWithLogging(`${API_URL}${endpoint}/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}/${id}:`, error);
    toast.error(`Error al cargar datos: ${(error as Error).message}`);
    return null;
  }
}

export async function createData<T>(endpoint: string, data: T): Promise<T | null> {
  try {
    console.log(`Creating data in ${endpoint}:`, data);
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

export async function updateData<T>(endpoint: string, id: number, data: T): Promise<T | null> {
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

export async function deleteData(endpoint: string, id: number): Promise<boolean> {
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
