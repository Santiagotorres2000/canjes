
import { Empresa } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const empresasApi = {
  getAll: () => fetchData<Empresa>("EmpresaRecolectora/Lista"),
  getById: (id: number) => fetchById<Empresa>("EmpresaRecolectora", id),
  create: (empresa: Empresa) => createData<Empresa>("EmpresaRecolectora/Nuevo", empresa),
  update: (id: number, empresa: Empresa) => {
    const empresaWithId = {
      ...empresa,
      idEmpresa: id
    };
    return updateData<Empresa>("EmpresaRecolectora/Editar", empresaWithId);
  },
  delete: (id: number) => deleteData("EmpresaRecolectora", id),
};
