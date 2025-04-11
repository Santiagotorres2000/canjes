import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Empresa, empresasApi } from "@/lib/api";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { toast } from "sonner";

const Empresas = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmpresa, setCurrentEmpresa] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState<Empresa>({
    nombre: "",
    tipoResiduo: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const empresasData = await empresasApi.getAll();
      setEmpresas(empresasData);
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    setCurrentEmpresa(null);
    setFormData({
      nombre: "",
      tipoResiduo: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (empresa: Empresa) => {
    setCurrentEmpresa(empresa);
    setFormData({
      nombre: empresa.nombre,
      tipoResiduo: empresa.tipoResiduo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (empresa: Empresa) => {
    setCurrentEmpresa(empresa);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (currentEmpresa?.idEmpresa) {
      const success = await empresasApi.delete(currentEmpresa.idEmpresa);
      if (success) {
        setEmpresas(empresas.filter(e => e.idEmpresa !== currentEmpresa.idEmpresa));
        toast.success("Empresa eliminada exitosamente");
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.tipoResiduo) {
      toast.error("Por favor complete los campos obligatorios.");
      return;
    }

    let result;
    if (currentEmpresa?.idEmpresa) {
      result = await empresasApi.update(currentEmpresa.idEmpresa, formData);
      if (result) {
        setEmpresas(
          empresas.map(e => 
            e.idEmpresa === currentEmpresa.idEmpresa ? { ...e, ...result } : e
          )
        );
      }
    } else {
      result = await empresasApi.create(formData);
      if (result) {
        setEmpresas([...empresas, result]);
      }
    }

    if (result) {
      setIsDialogOpen(false);
      toast.success(
        currentEmpresa 
          ? "Empresa actualizada exitosamente" 
          : "Empresa creada exitosamente"
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
      cell: (empresa: Empresa) => empresa.nombre,
    },
    {
      key: "tipoResiduo",
      header: "Tipo de Residuo",
      cell: (empresa: Empresa) => empresa.tipoResiduo,
    },
  ];

  return (
    <Layout>
      <PageHeader 
        title="Gestión de Empresas Recolectoras" 
        description="Administre las empresas de recolección de residuos"
        action={{
          label: "Nueva Empresa",
          onClick: handleAdd,
          icon: <Plus size={16} />,
        }}
      />

      <DataTable
        data={empresas}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getItemId={(empresa) => empresa.idEmpresa || 0}
        title="Empresas Recolectoras"
        addButtonText="Nueva Empresa"
      />

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentEmpresa ? "Editar Empresa" : "Crear Nueva Empresa"}
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tipoResiduo">Tipo de Residuo*</Label>
                <Input
                  id="tipoResiduo"
                  name="tipoResiduo"
                  value={formData.tipoResiduo}
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
        description={`¿Está seguro que desea eliminar la empresa ${currentEmpresa?.nombre}?`}
      />
    </Layout>
  );
};

export default Empresas;
