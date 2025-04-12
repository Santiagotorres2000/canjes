
import { Recoleccion } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const recoleccionesApi = {
  getAll: () => fetchData<Recoleccion>("Recolectar/Lista"),
  getById: (id: number) => fetchById<Recoleccion>("Recolectar", id),
  getByUsuario: (idUsuario: number) => fetchData<Recoleccion>(`Recolectar/Usuario/${idUsuario}`),
  create: (recoleccion: Recoleccion) => createData<Recoleccion>("Recolectar/Nuevo", recoleccion),
  update: (id: number, recoleccion: Recoleccion) => updateData<Recoleccion>("Recolectar", id, recoleccion),
  delete: (id: number) => deleteData("Recolectar", id),
};
