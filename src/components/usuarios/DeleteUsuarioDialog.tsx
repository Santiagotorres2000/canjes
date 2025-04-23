
import { Usuario, usuariosApi } from "@/lib/api";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { toast } from "sonner";

interface DeleteUsuarioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  onSuccess: (idUsuario: number) => void;
}

export function DeleteUsuarioDialog({
  isOpen,
  onClose,
  usuario,
  onSuccess,
}: DeleteUsuarioDialogProps) {
  const handleConfirmDelete = async () => {
    if (!usuario) {
      toast.error("Usuario no seleccionado");
      return;
    }
    
    const idUsuario = usuario.idUsuario;
    if (idUsuario === undefined || idUsuario === null) {
      toast.error("Usuario no identificado (ID no encontrado)");
      onClose();
      return;
    }
  
    console.log("Intentando eliminar usuario con ID:", idUsuario, "Tipo:", typeof idUsuario);
  
    try {
      const success = await usuariosApi.delete(Number(idUsuario));
      
      if (success) {
        toast.success("Usuario eliminado correctamente");
        onSuccess(idUsuario);
      } else {
        toast.error("No se pudo eliminar el usuario");
      }
  
    } catch (error) {
      console.error("Error en eliminación:", error);
      toast.error(
        (error as Error).message.includes("404") 
          ? "Usuario no encontrado en el servidor" 
          : `Error al eliminar: ${(error as Error).message}`
      );
    } finally {
      onClose();
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirmDelete}
      title="Confirmar Eliminación"
      description={`¿Está seguro que desea eliminar al usuario ${usuario?.nombre} ${usuario?.apellidos}?`}
    />
  );
}
