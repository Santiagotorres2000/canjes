
import { ConfiguracionPuntos } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const configuracionPuntosApi = {
  getAll: () => fetchData<ConfiguracionPuntos>("ConfiguracionPunto/Lista"),
  getById: (id: number) => fetchById<ConfiguracionPuntos>("ConfiguracionPunto", id),
  create: (config: ConfiguracionPuntos) => createData<ConfiguracionPuntos>("ConfiguracionPunto/Nuevo", config),
  update: (id: number, config: ConfiguracionPuntos) => {
    const configWithId = {
      ...config,
      idConfiguracion: id
    };
    return updateData<ConfiguracionPuntos>("ConfiguracionPunto/Editar", configWithId);
  },
  delete: (id: number) => deleteData("ConfiguracionPunto", id),
};
