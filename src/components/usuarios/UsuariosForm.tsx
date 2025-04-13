
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Usuario, Localidad, usuariosApi } from "@/lib/api";

interface UsuariosFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsuario: Usuario | null;
  localidades: Localidad[];
  onSuccess: (usuario: Usuario) => void;
}

const UsuariosForm = ({ isOpen, onClose, currentUsuario, localidades, onSuccess }: UsuariosFormProps) => {
  const [formData, setFormData] = useState<Usuario>(
    currentUsuario || {
      nombre: "",
      apellidos: "",
      telefono: "",
      email: "",
      direccion: "",
      rol: "Usuario",
      idLocalidad: undefined,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when dialog opens or user changes
  React.useEffect(() => {
    if (currentUsuario) {
      setFormData({
        nombre: currentUsuario.nombre,
        apellidos: currentUsuario.apellidos,
        telefono: currentUsuario.telefono,
        email: currentUsuario.email || "",
        direccion: currentUsuario.direccion || "",
        rol: currentUsuario.rol,
        idLocalidad: currentUsuario.idLocalidad,
      });
    } else {
      setFormData({
        nombre: "",
        apellidos: "",
        telefono: "",
        email: "",
        direccion: "",
        rol: "Usuario",
        idLocalidad: undefined,
      });
    }
  }, [currentUsuario, isOpen]);

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
      } else {
        console.log("Creating new user with data:", dataToSubmit);
        result = await usuariosApi.create(dataToSubmit);
        console.log("Create result:", result);
      }
      
      if (result) {
        onSuccess(result);
        onClose();
        toast.success(currentUsuario ? "Usuario actualizado exitosamente" : "Usuario creado exitosamente");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
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
                  <SelectContent className="bg-background">
                    {localidades && localidades.length > 0 ? (
                      localidades
                        .filter(localidad => localidad.idLocalidad != null)
                        .map((localidad) => (
                          <SelectItem
                            key={localidad.idLocalidad}
                            value={localidad.idLocalidad!.toString()}
                          >
                            {localidad.nombre}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="" disabled>
                        No hay localidades disponibles
                      </SelectItem>
                    )}
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
                <SelectContent className="bg-background">
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
              onClick={onClose}
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
  );
};

export default UsuariosForm;
