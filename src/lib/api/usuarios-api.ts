
import { Usuario } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const usuariosApi = {
  getAll: () => fetchData<Usuario>("Usuario/Lista"),
  getById: (id: number) => fetchById<Usuario>("Usuario", id),
  create: (usuario: Usuario) => createData<Usuario>("Usuario/Nuevo", usuario),
  update: (id: number, usuario: Usuario) => updateData<Usuario>("Usuario", id, usuario),
  delete: (id: number) => deleteData("Usuario", id),
};
