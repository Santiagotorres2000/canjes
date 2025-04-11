
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Usuario, usuariosApi, localidadesApi, Localidad } from "@/lib/api";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { toast } from "@/components/ui/sonner";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<Usuario>({
    nombre: "",
    apellidos: "",
    telefono: "",
    email: "",
    direccion: "",
    rol: "Usuario",
    idLocalidad: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      const usuariosData = await usuariosApi.getAll();
      setUsuarios(usuariosData);

      const localidadesData = await localidadesApi.getAll();
      setLocalidades(localidadesData);
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    setCurrentUsuario(null);
    setFormData({
      nombre: "",
      apellidos: "",
      telefono: "",
      email: "",
      direccion: "",
      rol: "Usuario",
      idLocalidad: undefined,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setCurrentUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      telefono: usuario.telefono,
      email: usuario.email || "",
      direccion: usuario.direccion || "",
      rol: usuario.rol,
      idLocalidad: usuario.idLocalidad,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (usuario: Usuario) => {
    setCurrentUsuario(usuario);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (currentUsuario?.idUsuario) {
      const success = await usuariosApi.delete(currentUsuario.idUsuario);
      if (success) {
        setUsuarios(usuarios.filter(u => u.idUsuario !== currentUsuario.idUsuario));
        toast.success("Usuario eliminado exitosamente");
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellidos || !formData.telefono) {
      toast.error("Por favor complete los campos obligatorios.");
      return;
    }

    let result;
    if (currentUsuario?.idUsuario) {
      result = await usuariosApi.update(currentUsuario.idUsuario, formData);
      if (result) {
        setUsuarios(
          usuarios.map(u => 
            u.idUsuario === currentUsuario.idUsuario ? { ...u, ...result } : u
          )
        );
      }
    } else {
      result = await usuariosApi.create(formData);
      if (result) {
        setUsuarios([...usuarios, result]);
      }
    }

    if (result) {
      setIsDialogOpen(false);
      toast.success(
        currentUsuario 
          ? "Usuario actualizado exitosamente" 
          : "Usuario creado exitosamente"
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "idLocalidad") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Define columns for data table
  const columns = [
    {
      key: "nombre",
      header: "Nombre",
      cell: (usuario: Usuario) => `${usuario.nombre} ${usuario.apellidos}`,
    },
    {
      key: "telefono",
      header: "Teléfono",
      cell: (usuario: Usuario) => usuario.telefono,
    },
    {
      key: "email",
      header: "Email",
      cell: (usuario: Usuario) => usuario.email || "N/A",
    },
    {
      key: "localidad",
      header: "Localidad",
      cell: (usuario: Usuario) => {
        const localidad = localidades.find(l => l.idLocalidad === usuario.idLocalidad);
        return localidad ? localidad.nombre : "N/A";
      },
    },
    {
      key: "rol",
      header: "Rol",
      cell: (usuario: Usuario) => usuario.rol,
    },
  ];

  return (
    <Layout>
      <PageHeader 
        title="Gestión de Usuarios" 
        description="Administre los usuarios del sistema"
        action={{
          label: "Nuevo Usuario",
          onClick: handleAdd,
          icon: <Plus size={16} />,
        }}
      />

      <DataTable
        data={usuarios}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getItemId={(usuario) => usuario.idUsuario || 0}
        title="Usuarios"
        addButtonText="Nuevo Usuario"
      />

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="nombre">Nombre*</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="apellidos">Apellidos*</Label>
                  <Input
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="telefono">Teléfono*</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="localidad">Localidad</Label>
                  <Select
                    value={formData.idLocalidad?.toString()}
                    onValueChange={(value) => handleSelectChange("idLocalidad", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {localidades.map((localidad) => (
                        <SelectItem
                          key={localidad.idLocalidad}
                          value={localidad.idLocalidad?.toString() || ""}
                        >
                          {localidad.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rol">Rol*</Label>
                <Select
                  value={formData.rol}
                  onValueChange={(value) => handleSelectChange("rol", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Usuario">Usuario</SelectItem>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Está seguro que desea eliminar al usuario ${currentUsuario?.nombre} ${currentUsuario?.apellidos}?`}
      />
    </Layout>
  );
};

export default Usuarios;
