
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Usuario, usuariosApi, localidadesApi, Localidad } from "@/lib/api";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { toast } from "sonner";
import UsuariosTable from "@/components/usuarios/UsuariosTable";
import UsuariosForm from "@/components/usuarios/UsuariosForm";

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

      <UsuariosTable
        usuarios={usuarios}
        localidades={localidades}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        error={error}
      />

      {/* Form Dialog */}
      <UsuariosForm
        isOpen={isDialogOpen}
        onClose={closeDialog}
        currentUsuario={currentUsuario}
        localidades={localidades}
        onSuccess={handleFormSuccess}
      />

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
