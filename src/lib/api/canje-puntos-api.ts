
import { CanjePuntos } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const canjePuntosApi = {
  getAll: () => fetchData<CanjePuntos>("CanjePunto/Lista"),
  getById: (id: number) => fetchById<CanjePuntos>("CanjePunto", id),
  getByUsuario: (idUsuario: number) => fetchData<CanjePuntos>(`CanjePunto/Usuario/${idUsuario}`),
  create: (canje: CanjePuntos) => createData<CanjePuntos>("CanjePunto/Nuevo", canje),
  update: (id: number, canje: CanjePuntos) => updateData<CanjePuntos>("CanjePunto", id, canje),
  delete: (id: number) => deleteData("CanjePunto", id),
};
