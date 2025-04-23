
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Usuario, Localidad, usuariosApi } from "@/lib/api";
import { DialogDescription } from "@radix-ui/react-dialog";

interface UsuariosFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsuario: Usuario | null;
  localidades: Localidad[];
  onSuccess: (usuario: Usuario) => void;
}

export function UsuariosForm({
  isOpen,
  onClose,
  currentUsuario,
  localidades,
  onSuccess
}: UsuariosFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      if (!formData.nombre || !formData.apellidos || !formData.telefono) {
        toast.error("Complete los campos obligatorios");
        return;
      }

      const dataToSubmit = {
        ...formData,
        idLocalidad: formData.idLocalidad ? Number(formData.idLocalidad) : undefined,
      };

      let result;
      if (currentUsuario?.idUsuario) {
        result = await usuariosApi.update(currentUsuario.idUsuario, dataToSubmit);
      } else {
        result = await usuariosApi.create(dataToSubmit);
      }

      onSuccess(result);
      toast.success(
        currentUsuario 
          ? "Usuario actualizado exitosamente" 
          : "Usuario creado exitosamente"
      );
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error al ${currentUsuario ? "actualizar" : "crear"} el usuario`);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                      .filter((l) => l.idLocalidad !== undefined && l.idLocalidad !== null)
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
}
