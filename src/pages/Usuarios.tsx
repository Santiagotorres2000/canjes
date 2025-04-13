
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Usuario, usuariosApi, localidadesApi, Localidad } from "@/lib/api";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch localidades first
        console.log("Fetching localidades data...");
        const localidadesData = await localidadesApi.getAll();
        console.log("Localidades data received:", localidadesData);
        
        if (Array.isArray(localidadesData) && localidadesData.length > 0) {
          setLocalidades(localidadesData);
        } else {
          console.warn("No localidades data received or empty array");
          setLocalidades([]);
        }

        // Then fetch usuarios
        console.log("Fetching usuarios data...");
        const usuariosData = await usuariosApi.getAll();
        console.log("Usuarios data received:", usuariosData);
        setUsuarios(usuariosData);
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
    setIsDialogOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setCurrentUsuario(usuario);
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

  const handleFormSuccess = (usuario: Usuario) => {
    if (currentUsuario?.idUsuario) {
      // Update
      setUsuarios(prevUsuarios => 
        prevUsuarios.map(u => 
          u.idUsuario === currentUsuario.idUsuario ? { ...u, ...usuario } : u
        )
      );
    } else {
      // Create
      setUsuarios(prevUsuarios => [...prevUsuarios, usuario]);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
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
