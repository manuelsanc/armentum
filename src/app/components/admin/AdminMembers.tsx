import { useEffect, useState } from "react";
import { toast } from "sonner";
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
  telefono?: string;
  fecha_ingreso: string;
  estado: string;
  password?: string;
}

const VOICE_OPTIONS = ["Soprano", "Alto", "Tenor", "Bajo"] as const;

const STATUS_OPTIONS = [
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
  { value: "suspendido", label: "Suspendido" },
];

const formatDate = (input?: string): string => {
  if (!input) return new Date().toISOString().slice(0, 10);
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const resolveVoice = (voice?: string | null): string => {
  if (!voice) return VOICE_OPTIONS[0];
  const normalized = voice.trim();
  const match = VOICE_OPTIONS.find((option) => option.toLowerCase() === normalized.toLowerCase());
  return match ?? VOICE_OPTIONS[0];
};

const resolveStatus = (estado?: string, activo?: boolean): string => {
  if (estado) return estado;
  if (typeof activo === "boolean") {
    return activo ? "activo" : "inactivo";
  }
  return "activo";
};

const getStatusLabel = (estado: string): string => {
  const match = STATUS_OPTIONS.find((option) => option.value === estado);
  return match ? match.label : estado;
};

export function AdminMembers(): JSX.Element {
  const {
    members,
    total,
    isLoading,
    currentPage,
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
    voz: "Soprano",
    telefono: "",
    fecha_ingreso: new Date().toISOString().slice(0, 10),
    estado: "activo",
    password: "",
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

  const statusFilterValue = status || "all";

  const resolveMemberStatus = (member: MemberProfile): string =>
    resolveStatus(member.estado, member.activo);

  const handleOpenDialog = (member?: MemberProfile) => {
    if (member) {
      setEditingId(member.id);
      setFormState({
        email: member.email,
        nombre: member.nombre || "",
        voz: resolveVoice(member.voz),
        telefono: member.telefonoContacto || member.telefono || "",
        fecha_ingreso: formatDate(member.fechaIngreso || member.fecha_ingreso),
        estado: resolveStatus(member.estado, member.activo),
        password: "",
      });
    } else {
      setEditingId(null);
      setFormState({
        email: "",
        nombre: "",
        voz: VOICE_OPTIONS[0],
        telefono: "",
        fecha_ingreso: new Date().toISOString().slice(0, 10),
        estado: "activo",
        password: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormState({
      email: "",
      nombre: "",
      voz: VOICE_OPTIONS[0],
      telefono: "",
      fecha_ingreso: new Date().toISOString().slice(0, 10),
      estado: "activo",
      password: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formState.email || !formState.nombre) {
      toast.error("Email y Nombre son requeridos");
      return;
    }

    if (!editingId && !formState.password) {
      toast.error("Contraseña es requerida para nuevos miembros");
      return;
    }

    try {
      const payload = editingId
        ? {
            voz: formState.voz || undefined,
            estado: formState.estado,
            telefono: formState.telefono || undefined,
          }
        : {
            email: formState.email,
            nombre: formState.nombre,
            password: formState.password,
            voz: formState.voz,
            fecha_ingreso: formState.fecha_ingreso,
            telefono: formState.telefono || undefined,
          };

      if (editingId) {
        await updateMember(editingId, payload);
      } else {
        const created = await createMember(payload);
        if (created && formState.estado !== "activo") {
          await updateMember(created.id, { estado: formState.estado });
        }
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
                      {VOICE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formState.telefono || ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        telefono: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_ingreso">Fecha de ingreso</Label>
                  <Input
                    id="fecha_ingreso"
                    type="date"
                    value={formState.fecha_ingreso}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        fecha_ingreso: e.target.value,
                      })
                    }
                    required
                    disabled={Boolean(editingId)}
                  />
                </div>
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
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {!editingId && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formState.password || ""}
                      onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      required={!editingId}
                    />
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
            <Select value={statusFilterValue} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
                              resolveMemberStatus(member) === "activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {getStatusLabel(resolveMemberStatus(member))}
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
