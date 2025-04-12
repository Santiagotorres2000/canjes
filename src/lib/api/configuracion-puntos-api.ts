
import { ConfiguracionPuntos } from "./types";
import { fetchData, fetchById, createData, updateData, deleteData } from "./api-utils";

export const configuracionPuntosApi = {
  getAll: () => fetchData<ConfiguracionPuntos>("ConfiguracionPunto/Lista"),
  getById: (id: number) => fetchById<ConfiguracionPuntos>("ConfiguracionPunto", id),
  create: (config: ConfiguracionPuntos) => createData<ConfiguracionPuntos>("ConfiguracionPunto/Nuevo", config),
  update: (id: number, config: ConfiguracionPuntos) => updateData<ConfiguracionPuntos>("ConfiguracionPunto", id, config),
  delete: (id: number) => deleteData("ConfiguracionPunto", id),
};
