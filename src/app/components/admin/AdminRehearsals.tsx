import { useEffect, useState } from "react";
import { useAdminRehearsals } from "../../../hooks/useAdminRehearsals";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Rehearsal } from "../../../types";

interface RehearsalFormState {
  nombre: string;
  tipo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
  cuerdas: string;
}

const REHEARSAL_TYPES = [
  { value: "general", label: "General" },
  { value: "seccional", label: "Seccional" },
  { value: "otra_actividad", label: "Otra Actividad" },
];

export function AdminRehearsals(): JSX.Element {
  const {
    rehearsals,
    total,
    isLoading,
    currentPage,
    fetchRehearsals,
    createRehearsal,
    updateRehearsal,
    deleteRehearsal,
    goToPage,
  } = useAdminRehearsals(10);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rehearsalToDelete, setRehearsalToDelete] = useState<string | null>(null);
  const [formState, setFormState] = useState<RehearsalFormState>({
    nombre: "",
    tipo: "general",
    descripcion: "",
    fecha: "",
    hora: "",
    lugar: "",
    cuerdas: "",
  });

  useEffect(() => {
    fetchRehearsals();
  }, []);

  const handleOpenDialog = (rehearsal?: Rehearsal) => {
    if (rehearsal) {
      setEditingId(rehearsal.id);
      setFormState({
        nombre: rehearsal.titulo || rehearsal.nombre || "",
        tipo: rehearsal.tipo || "general",
        descripcion: rehearsal.descripcion || "",
        fecha: rehearsal.fecha,
        hora: rehearsal.horaInicio || rehearsal.hora || "",
        lugar: rehearsal.lugar,
        cuerdas: rehearsal.cuerdas || "",
      });
    } else {
      setEditingId(null);
      setFormState({
        nombre: "",
        tipo: "general",
        descripcion: "",
        fecha: "",
        hora: "",
        lugar: "",
        cuerdas: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateRehearsal(editingId, formState);
      } else {
        await createRehearsal(formState);
      }
      handleCloseDialog();
    } catch {
      // Error already handled by hook
    }
  };

  const handleDeleteClick = (id: string) => {
    setRehearsalToDelete(id);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (rehearsalToDelete) {
      try {
        await deleteRehearsal(rehearsalToDelete);
        setIsAlertOpen(false);
        setRehearsalToDelete(null);
      } catch {
        // Error already handled by hook
      }
    }
  };

  const totalPages = Math.ceil(total / 10);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("es-ES");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Gestión de Ensayos</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Ensayo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Ensayo" : "Crear Nuevo Ensayo"}</DialogTitle>
                <DialogDescription>Completa los datos del ensayo</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre/Título</Label>
                    <Input
                      id="nombre"
                      value={formState.nombre}
                      onChange={(e) => setFormState({ ...formState, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Ensayo</Label>
                    <Select
                      value={formState.tipo}
                      onValueChange={(value) => setFormState({ ...formState, tipo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {REHEARSAL_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formState.descripcion}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        descripcion: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formState.fecha}
                      onChange={(e) => setFormState({ ...formState, fecha: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora</Label>
                    <Input
                      id="hora"
                      type="time"
                      value={formState.hora}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          hora: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lugar">Lugar</Label>
                    <Input
                      id="lugar"
                      value={formState.lugar}
                      onChange={(e) => setFormState({ ...formState, lugar: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuerdas">Cuerdas (opcional)</Label>
                  <Input
                    id="cuerdas"
                    value={formState.cuerdas}
                    onChange={(e) => setFormState({ ...formState, cuerdas: e.target.value })}
                    placeholder="Ej: Soprano, Alto, Tenor, Bajo"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">{editingId ? "Actualizar" : "Crear"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Cargando ensayos...</div>
          ) : rehearsals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay ensayos registrados</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Lugar</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rehearsals.map((rehearsal) => (
                      <TableRow key={rehearsal.id}>
                        <TableCell className="font-medium">
                          {rehearsal.titulo || rehearsal.nombre}
                        </TableCell>
                        <TableCell>{formatDate(rehearsal.fecha)}</TableCell>
                        <TableCell>{rehearsal.horaInicio || rehearsal.hora}</TableCell>
                        <TableCell>{rehearsal.lugar}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              rehearsal.tipo === "general"
                                ? "bg-blue-100 text-blue-800"
                                : rehearsal.tipo === "seccional"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {rehearsal.tipo === "general"
                              ? "General"
                              : rehearsal.tipo === "seccional"
                                ? "Seccional"
                                : rehearsal.tipo === "otra_actividad"
                                  ? "Otra Actividad"
                                  : rehearsal.tipo}
                          </span>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(rehearsal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(rehearsal.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                        className={
                          currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => goToPage(i + 1)}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Ensayo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El ensayo será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
