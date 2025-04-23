
import { Localidad } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const localidadesApi = {
  getAll: async () => {
    console.log("Calling getAll in localidadesApi");
    try {
      const result = await fetchData<Localidad>("Localidad/Lista");
      console.log("Localidades API result:", result);
      return result;
    } catch (error) {
      console.error("Error in localidades getAll:", error);
      throw error;
    }
  },
  getById: (id: number) => fetchById<Localidad>("Localidad", id),
  create: (localidad: Localidad) => createData<Localidad>("Localidad/Nuevo", localidad),
  update: (id: number, localidad: Localidad) => {
    const localidadWithId = {
      ...localidad,
      idLocalidad: id
    };
    return updateData<Localidad>("Localidad/Editar", localidadWithId);
  },
  delete: (id: number) => deleteData("Localidad", id),
};
