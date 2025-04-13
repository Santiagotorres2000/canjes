
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
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching usuarios data...");
        const usuariosData = await usuariosApi.getAll();
        console.log("Usuarios data received:", usuariosData);
        setUsuarios(usuariosData);

        console.log("Fetching localidades data...");
        const localidadesData = await localidadesApi.getAll();
        console.log("Localidades data received:", localidadesData);
        setLocalidades(localidadesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Error al cargar datos: ${(err as Error).message}`);
        toast.error(`Error al cargar datos: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
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
    
    try {
      // Prevent multiple submissions
      if (isSubmitting) {
        return;
      }
      
      setIsSubmitting(true);
      
      if (!formData.nombre || !formData.apellidos || !formData.telefono) {
        toast.error("Por favor complete los campos obligatorios.");
        setIsSubmitting(false);
        return;
      }

      // Make a copy of the form data to avoid issues with undefined fields
      const dataToSubmit = { ...formData };
      
      // Verify idLocalidad is properly formatted
      if (dataToSubmit.idLocalidad) {
        dataToSubmit.idLocalidad = Number(dataToSubmit.idLocalidad);
      }

      let result;
      console.log("Processing form submission:", dataToSubmit);
      
      if (currentUsuario?.idUsuario) {
        console.log("Updating user:", currentUsuario.idUsuario);
        result = await usuariosApi.update(currentUsuario.idUsuario, dataToSubmit);
        console.log("Update result:", result);
        
        if (result) {
          setUsuarios(prevUsuarios => 
            prevUsuarios.map(u => 
              u.idUsuario === currentUsuario.idUsuario ? { ...u, ...result } : u
            )
          );
          setIsDialogOpen(false);
          toast.success("Usuario actualizado exitosamente");
        }
      } else {
        console.log("Creating new user with data:", dataToSubmit);
        result = await usuariosApi.create(dataToSubmit);
        console.log("Create result:", result);
        
        if (result) {
          setUsuarios(prevUsuarios => [...prevUsuarios, result]);
          setIsDialogOpen(false);
          toast.success("Usuario creado exitosamente");
        }
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "idLocalidad") {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  const closeDialog = () => {
    setIsDialogOpen(false);
    // Reset form state
    setFormData({
      nombre: "",
      apellidos: "",
      telefono: "",
      email: "",
      direccion: "",
      rol: "Usuario",
      idLocalidad: undefined,
    });
  };

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

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Cargando datos...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : (
        <DataTable
          data={usuarios}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getItemId={(usuario) => usuario.idUsuario?.toString() || Math.random().toString()}
          title="Usuarios"
          addButtonText="Nuevo Usuario"
        />
      )}

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}>
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            Complete los campos requeridos para {currentUsuario ? "editar" : "crear"} el usuario.
          </DialogDescription>
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
                    value={formData.idLocalidad?.toString() || ""}
                    onValueChange={(value) => handleSelectChange("idLocalidad", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                    {localidades
                      .filter(localidad => localidad.idLocalidad != null)
                      .map((localidad) => (
                        <SelectItem
                          key={localidad.idLocalidad}
                          value={localidad.idLocalidad.toString()}
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeDialog}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
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
