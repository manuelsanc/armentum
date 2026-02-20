import { useEffect, useState } from "react";
import { useAdminEvents } from "../../../hooks/useAdminEvents";
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
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Event } from "../../../types";

interface EventFormState {
  nombre: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
  tipo: string;
}

const EVENT_TYPES = [
  { value: "concierto", label: "Concierto" },
  { value: "actividad", label: "Actividad" },
  { value: "otro", label: "Otro" },
];

export function AdminEvents(): JSX.Element {
  const {
    events,
    total,
    isLoading,
    currentPage,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    goToPage,
  } = useAdminEvents(10);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [formState, setFormState] = useState<EventFormState>({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora: "",
    lugar: "",
    tipo: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setEditingId(event.id);
      setFormState({
        nombre: event.nombre || event.title || "",
        descripcion: event.descripcion || event.description || "",
        fecha: event.fecha || event.date || "",
        hora: event.hora || "",
        lugar: event.lugar || event.location || "",
        tipo: event.tipo || "",
      });
    } else {
      setEditingId(null);
      setFormState({
        nombre: "",
        descripcion: "",
        fecha: "",
        hora: "",
        lugar: "",
        tipo: "",
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
        await updateEvent(editingId, formState);
      } else {
        await createEvent(formState);
      }
      handleCloseDialog();
    } catch {
      // Error already handled by hook
    }
  };

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete);
        setIsAlertOpen(false);
        setEventToDelete(null);
      } catch {
        // Error already handled by hook
      }
    }
  };

  const totalPages = Math.ceil(total / 10);

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Gestión de Eventos</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Evento" : "Crear Nuevo Evento"}</DialogTitle>
                <DialogDescription>Completa los datos del evento</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={formState.nombre}
                      onChange={(e) => setFormState({ ...formState, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select
                      value={formState.tipo}
                      onValueChange={(value) => setFormState({ ...formState, tipo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map((type) => (
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
                      onChange={(e) => setFormState({ ...formState, hora: e.target.value })}
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
            <div className="text-center py-8">Cargando eventos...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay eventos registrados</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Lugar</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.nombre || event.title}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              event.tipo === "concierto"
                                ? "bg-blue-100 text-blue-800"
                                : event.tipo === "actividad"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {event.tipo === "concierto"
                              ? "Concierto"
                              : event.tipo === "actividad"
                                ? "Actividad"
                                : event.tipo === "otro"
                                  ? "Otro"
                                  : event.tipo || "-"}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(event.fecha || event.date || "")}</TableCell>
                        <TableCell>{event.lugar || event.location}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(event)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(event.id)}
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
            <AlertDialogTitle>¿Eliminar Evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El evento será eliminado permanentemente.
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
