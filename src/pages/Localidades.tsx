import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Localidad, localidadesApi } from "@/lib/api";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { toast } from "sonner";

const Localidades = () => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLocalidad, setCurrentLocalidad] = useState<Localidad | null>(null);
  const [formData, setFormData] = useState<Localidad>({
    nombre: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const localidadesData = await localidadesApi.getAll();
      setLocalidades(localidadesData);
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    setCurrentLocalidad(null);
    setFormData({
      nombre: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (localidad: Localidad) => {
    setCurrentLocalidad(localidad);
    setFormData({
      nombre: localidad.nombre,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (localidad: Localidad) => {
    setCurrentLocalidad(localidad);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (currentLocalidad?.idLocalidad) {
      const success = await localidadesApi.delete(currentLocalidad.idLocalidad);
      if (success) {
        setLocalidades(localidades.filter(l => l.idLocalidad !== currentLocalidad.idLocalidad));
        toast.success("Localidad eliminada exitosamente");
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre) {
      toast.error("Por favor ingrese el nombre de la localidad.");
      return;
    }

    let result;
    if (currentLocalidad?.idLocalidad) {
      result = await localidadesApi.update(currentLocalidad.idLocalidad, formData);
      if (result) {
        setLocalidades(
          localidades.map(l => 
            l.idLocalidad === currentLocalidad.idLocalidad ? { ...l, ...result } : l
          )
        );
      }
    } else {
      result = await localidadesApi.create(formData);
      if (result) {
        setLocalidades([...localidades, result]);
      }
    }

    if (result) {
      setIsDialogOpen(false);
      toast.success(
        currentLocalidad 
          ? "Localidad actualizada exitosamente" 
          : "Localidad creada exitosamente"
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Define columns for data table
  const columns = [
    {
      key: "nombre",
      header: "Nombre",
      cell: (localidad: Localidad) => localidad.nombre,
    },
  ];

  return (
    <Layout>
      <PageHeader 
        title="Gestión de Localidades" 
        description="Administre las localidades del sistema"
        action={{
          label: "Nueva Localidad",
          onClick: handleAdd,
          icon: <Plus size={16} />,
        }}
      />

      <DataTable
        data={localidades}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getItemId={(localidad) => localidad.idLocalidad || 0}
        title="Localidades"
        addButtonText="Nueva Localidad"
      />

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentLocalidad ? "Editar Localidad" : "Crear Nueva Localidad"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
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
        description={`¿Está seguro que desea eliminar la localidad ${currentLocalidad?.nombre}?`}
      />
    </Layout>
  );
};

export default Localidades;
