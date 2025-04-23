
import { Usuario } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const usuariosApi = {
  getAll: () => fetchData<Usuario>("Usuario/Lista"),
  getById: (id: number) => fetchById<Usuario>("Usuario", id),
  create: (usuario: Usuario) => createData<Usuario>("Usuario/Nuevo", usuario),
  update: (id: number, usuario: Usuario) => {
    // Asegurarse de que el ID está incluido en el objeto de usuario
    const usuarioWithId = {
      ...usuario,
      idUsuario: id
    };
    return updateData<Usuario>("Usuario/Editar", usuarioWithId);
  },
  delete: (id: number) => {
    console.log("Deleting usuario with ID:", id);
    // Asegurar que el ID sea un número válido
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      console.error("Invalid usuario ID for deletion:", id);
      return Promise.reject(new Error("ID de usuario inválido"));
    }
    return deleteData("Usuario/Eliminar", id);
  },
};
