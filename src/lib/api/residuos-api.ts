
import { Residuo } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const residuosApi = {
  getAll: () => fetchData<Residuo>("Residuo/Lista"),
  getById: (id: number) => fetchById<Residuo>("Residuo", id),
  create: (residuo: Residuo) => createData<Residuo>("Residuo/Nuevo", residuo),
  update: (id: number, residuo: Residuo) => {
    const residuoWithId = {
      ...residuo,
      idResiduo: id
    };
    return updateData<Residuo>("Residuo/Editar", residuoWithId);
  },
  delete: (id: number) => deleteData("Residuo", id),
};
