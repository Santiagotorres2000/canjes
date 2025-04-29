
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { CanjePuntos, canjePuntosApi, Usuario, usuariosApi } from "@/lib/api";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { toast } from "sonner";
import { format } from "date-fns";

const Canjes = () => {
  const [searchQuery, setSearchQuery] = useState ("");
  const [canjes, setCanjes] = useState<CanjePuntos[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCanje, setCurrentCanje] = useState<CanjePuntos | null>(null);
  const [formData, setFormData] = useState<CanjePuntos>({
    idUsuario: 0,
    puntosUsados: 0,
    tienda: "",
    fechaCanje: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching canjes data...");
        const canjesData = await canjePuntosApi.getAll();
        console.log("Canjes data received:", canjesData);
        setCanjes(canjesData);

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
  const filteredCanjes = canjes.filter((canje) => {
    const usuario = usuarios.find((u) => u.idUsuario === canje.idUsuario);
    const nombreUsuario = usuario ? `${usuario.nombre} ${usuario.apellidos}`.toLowerCase() : "";
    const tienda = canje.tienda.toLowerCase();
    const query = searchQuery.toLowerCase();

    return nombreUsuario.includes(query) || tienda.includes(query);
  });


  const handleAdd = () => {
    setCurrentCanje(null);
    setFormData({
      idUsuario: 0,
      puntosUsados: 0,
      tienda: "",
      fechaCanje: new Date().toISOString()
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (canje: CanjePuntos) => {
    setCurrentCanje(canje);
    setFormData({
      idUsuario: canje.idUsuario,
      puntosUsados: canje.puntosUsados,
      tienda: canje.tienda,
      fechaCanje: canje.fechaCanje || new Date().toISOString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (canje: CanjePuntos) => {
    setCurrentCanje(canje);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (currentCanje?.idCanje) {
      const success = await canjePuntosApi.delete(currentCanje.idCanje);
      if (success) {
        setCanjes(canjes.filter(c => c.idCanje !== currentCanje.idCanje));
        toast.success("Canje eliminado exitosamente");
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.idUsuario || !formData.puntosUsados || !formData.tienda) {
      toast.error("Por favor complete los campos obligatorios.");
      return;
    }

    let result;
    if (currentCanje?.idCanje) {
      result = await canjePuntosApi.update(currentCanje.idCanje, formData);
      if (result) {
        setCanjes(
          canjes.map(c => 
            c.idCanje === currentCanje.idCanje ? { ...c, ...result } : c
          )
        );
      }
    } else {
      result = await canjePuntosApi.create(formData);
      if (result) {
        setCanjes([...canjes, result]);
      }
    }

    if (result) {
      setIsDialogOpen(false);
      toast.success(
        currentCanje 
          ? "Canje actualizado exitosamente" 
          : "Canje creado exitosamente"
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "puntosUsados" ? Number(value) : value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "idUsuario") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Define columns for data table
  const columns = [
    {
      key: "usuario",
      header: "Usuario",
      cell: (canje: CanjePuntos) => {
        const usuario = usuarios.find(u => u.idUsuario === canje.idUsuario);
        return usuario ? `${usuario.nombre} ${usuario.apellidos}` : "N/A";
      },
    },
    {
      key: "puntosUsados",
      header: "Puntos Usados",
      cell: (canje: CanjePuntos) => canje.puntosUsados,
    },
    {
      key: "tienda",
      header: "Tienda",
      cell: (canje: CanjePuntos) => canje.tienda,
    },
    {
      key: "fechaCanje",
      header: "Fecha de Canje",
      cell: (canje: CanjePuntos) => canje.fechaCanje ? format(new Date(canje.fechaCanje), 'dd/MM/yyyy') : "N/A",
    },
  ];

  return (
    <Layout>
      <PageHeader 
        title="Gestión de Canjes" 
        description="Administre los canjes de puntos del sistema"
        action={{
          label: "➕ Nuevo Canje",
          onClick: handleAdd,
          icon: <Plus size={20} />,
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
        <>
       <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <DataTable
        data={filteredCanjes}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getItemId={(canje)=>canje.idCanje || 0 }
        title="Canjes"
        addButtonText="Nuevo Canje"
        />
       </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentCanje ? "Editar Canje" : "Crear Nuevo Canje"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idUsuario">Usuario*</Label>
                <Select
                  value={formData.idUsuario?.toString()}
                  onValueChange={(value) => handleSelectChange("idUsuario", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((usuario) => (
                      <SelectItem
                        key={usuario.idUsuario}
                        value={usuario.idUsuario?.toString() || ""}
                      >
                        {usuario.nombre} {usuario.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="puntosUsados">Puntos Usados*</Label>
                <Input
                  id="puntosUsados"
                  name="puntosUsados"
                  type="number"
                  value={formData.puntosUsados}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tienda">Tienda*</Label>
                <Input
                  id="tienda"
                  name="tienda"
                  value={formData.tienda}
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
        description={`¿Está seguro que desea eliminar este canje?`}
        
      />
      </>
      )}
    </Layout>
  );
};

export default Canjes;
