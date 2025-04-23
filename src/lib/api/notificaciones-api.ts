
import { Notificacion } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const notificacionesApi = {
  getAll: () => fetchData<Notificacion>("Notificacion/Lista"),
  getById: (id: number) => fetchById<Notificacion>("Notificacion", id),
  getByUsuario: (idUsuario: number) => fetchData<Notificacion>(`Notificacion/Usuario/${idUsuario}`),
  create: (notificacion: Notificacion) => createData<Notificacion>("Notificacion/Nuevo", notificacion),
  update: (id: number, notificacion: Notificacion) => {
    const notificacionWithId = {
      ...notificacion,
      idNotificacion: id
    };
    return updateData<Notificacion>("Notificacion/Editar", notificacionWithId);
  },
  delete: (id: number) => deleteData("Notificacion", id),
};
