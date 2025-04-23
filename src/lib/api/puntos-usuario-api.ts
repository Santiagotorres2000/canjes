
import { PuntosUsuario } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const puntosUsuarioApi = {
  getAll: () => fetchData<PuntosUsuario>("PuntosUsuario/Lista"),
  getById: (id: number) => fetchById<PuntosUsuario>("PuntosUsuario", id),
  getByUsuario: (idUsuario: number) => fetchData<PuntosUsuario>(`PuntosUsuario/Usuario/${idUsuario}`),
  create: (puntos: PuntosUsuario) => createData<PuntosUsuario>("PuntosUsuario/Nuevo", puntos),
  update: (id: number, puntos: PuntosUsuario) => {
    const puntosWithId = {
      ...puntos,
      idPuntos: id
    };
    return updateData<PuntosUsuario>("PuntosUsuario/Editar", puntosWithId);
  },
  delete: (id: number) => deleteData("PuntosUsuario", id),
};
