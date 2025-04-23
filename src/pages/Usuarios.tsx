
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Usuario, usuariosApi, localidadesApi, Localidad, RawLocalidad } from "@/lib/api";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { UsuariosForm } from "@/components/usuarios/UsuariosForm";
import { DeleteUsuarioDialog } from "@/components/usuarios/DeleteUsuarioDialog";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.log("Localidades data received (raw):", localidadesData);
        const normalizedLocalidades = (localidadesData as RawLocalidad[]).map((l) => ({
          idLocalidad: l.idLocalidad ?? l.idlocalidad,
          nombre: l.nombre,
        }));
        setLocalidades(normalizedLocalidades);
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
    setIsFormDialogOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setCurrentUsuario(usuario);
    setIsFormDialogOpen(true);
  };

  const handleDelete = (usuario: Usuario) => {
    if (!usuario || usuario.idUsuario === undefined || usuario.idUsuario === null) {
      toast.error("No se puede eliminar: Usuario sin identificador");
      return;
    }
    
    setCurrentUsuario(usuario);
    setIsDeleteDialogOpen(true);
  };

  const handleUsuarioSaved = (usuario: Usuario) => {
    if (currentUsuario?.idUsuario) {
      setUsuarios(prev => prev.map(u => 
        u.idUsuario === usuario.idUsuario ? usuario : u
      ));
    } else {
      setUsuarios(prev => [...prev, usuario]);
    }
    setIsFormDialogOpen(false);
  };

  const handleUsuarioDeleted = (deletedId: number) => {
    setUsuarios(prev => prev.filter(u => u.idUsuario !== deletedId));
  };

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
          getItemId={(usuario) => 
            usuario.idUsuario?.toString() || `temp-${Math.random().toString(36).substr(2, 9)}`
          }
          title="Usuarios"
          addButtonText="Nuevo Usuario"
        />
      )}

      <UsuariosForm
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        currentUsuario={currentUsuario}
        localidades={localidades}
        onSuccess={handleUsuarioSaved}
      />

      <DeleteUsuarioDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        usuario={currentUsuario}
        onSuccess={handleUsuarioDeleted}
      />
    </Layout>
  );
};

export default Usuarios;
