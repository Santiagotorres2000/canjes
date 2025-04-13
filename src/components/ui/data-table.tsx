import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    cell: (item: T) => React.ReactNode;
  }[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  getItemId: (item: T) => number | string;
  title: string;
  addButtonText?: string;
}

export function DataTable<T>({
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  getItemId,
  title,
  addButtonText = "Agregar"
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Corregido: Usar referencias estables para los datos filtrados
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      return Object.values(item as Record<string, unknown>).some((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm]);

  // Corregido: Calcular totalPages basado en datos filtrados
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Corregido: Manejo de acciones con referencias correctas
  const handleEdit = (item: T) => {
    console.log("Editing item:", item);
    onEdit?.(item);
  };

  const handleDelete = (item: T) => {
    console.log("Deleting item:", item);
    onDelete?.(item);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {onAdd && (
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus size={16} /> {addButtonText}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Resetear a primera página al buscar
            }}
            className="pl-8"
          />
        </div>
        <select
          className="px-2 py-2 rounded border bg-background text-foreground"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // Resetear a primera página al cambiar items por página
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="rounded-md border">
      <Table>
  <TableHeader>
    <TableRow>
      {columns.map((column) => (
        <TableHead key={column.key}>{column.header}</TableHead>
      ))}
      {(onEdit || onDelete) && (
        <TableHead className="text-right">Acciones</TableHead>
      )}
    </TableRow>
  </TableHeader>
  <TableBody>
    {paginatedData.length > 0 ? (
      paginatedData.map((item) => {
        const itemId = getItemId(item);
        return (
          <TableRow key={itemId}>
            {columns.map((column) => (
              <TableCell key={`${itemId}-${column.key}`}>
                {column.cell(item)}
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell className="text-right space-x-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(item)}
                    data-testid={`edit-${itemId}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(item)}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    data-testid={`delete-${itemId}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        );
      })
    ) : (
      <TableRow>
        <TableCell 
          colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} 
          className="text-center py-6"
        >
          No se encontraron registros
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center gap-2 mt-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} de{" "}
            {filteredData.length} registros
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="px-4 py-2 text-sm">
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}