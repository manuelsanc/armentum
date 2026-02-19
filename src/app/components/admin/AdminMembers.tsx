import { useEffect, useState } from "react";
import { useAdminMembers } from "../../../hooks/useAdminMembers";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Label } from "../ui/label";
import type { MemberProfile } from "../../../types";

interface MemberFormState {
  email: string;
  nombre: string;
  voz: string;
  direccion: string;
  telefonoContacto: string;
  estado: string;
}

export function AdminMembers(): JSX.Element {
  const {
    members,
    total,
    isLoading,
    currentPage,
    search,
    status,
    fetchMembers,
    createMember,
    updateMember,
    deactivateMember,
    searchMembers,
    filterByStatus,
    goToPage,
  } = useAdminMembers(10);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [formState, setFormState] = useState<MemberFormState>({
    email: "",
    nombre: "",
    voz: "",
    direccion: "",
    telefonoContacto: "",
    estado: "activo",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    searchMembers(value);
  };

  const handleStatusChange = (value: string) => {
    filterByStatus(value === "all" ? "" : value);
  };

  const handleOpenDialog = (member?: MemberProfile) => {
    if (member) {
      setEditingId(member.id);
      setFormState({
        email: member.email,
        nombre: member.nombre || "",
        voz: member.voz || "",
        direccion: member.direccion || "",
        telefonoContacto: member.telefonoContacto || "",
        estado: member.activo ? "activo" : "inactivo",
      });
    } else {
      setEditingId(null);
      setFormState({
        email: "",
        nombre: "",
        voz: "",
        direccion: "",
        telefonoContacto: "",
        estado: "activo",
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
        await updateMember(editingId, formState);
      } else {
        await createMember(formState);
      }
      handleCloseDialog();
    } catch {
      // Error already handled by hook
    }
  };

  const handleDeleteClick = (id: string) => {
    setMemberToDelete(id);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (memberToDelete) {
      try {
        await deactivateMember(memberToDelete);
        setIsAlertOpen(false);
        setMemberToDelete(null);
      } catch {
        // Error already handled by hook
      }
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Gestión de Miembros</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Agregar Miembro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Miembro" : "Crear Nuevo Miembro"}</DialogTitle>
                <DialogDescription>Completa los datos del miembro</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                  />
                </div>
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
                  <Label htmlFor="voz">Voz</Label>
                  <Select
                    value={formState.voz}
                    onValueChange={(value) => setFormState({ ...formState, voz: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona voz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soprano">Soprano</SelectItem>
                      <SelectItem value="mezzosoprano">Mezzosoprano</SelectItem>
                      <SelectItem value="contralto">Contralto</SelectItem>
                      <SelectItem value="tenor">Tenor</SelectItem>
                      <SelectItem value="barítono">Barítono</SelectItem>
                      <SelectItem value="bajo">Bajo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formState.telefonoContacto}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        telefonoContacto: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formState.direccion}
                    onChange={(e) => setFormState({ ...formState, direccion: e.target.value })}
                  />
                </div>
                {editingId && (
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={formState.estado}
                      onValueChange={(value) => setFormState({ ...formState, estado: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={status || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Cargando miembros...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay miembros registrados</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Voz</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.nombre}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.voz || "-"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              member.activo
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.activo ? "Activo" : "Inactivo"}
                          </span>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(member)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {member.activo && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(member.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
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
            <AlertDialogTitle>¿Desactivar Miembro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará el miembro. Podrá reactivarlo más adelante.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Desactivar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
