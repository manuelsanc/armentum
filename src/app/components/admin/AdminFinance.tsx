import { useEffect, useState } from "react";
import { useAdminFinance } from "../../../hooks/useAdminFinance";
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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Plus, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { Cuota } from "../../../types";

interface CuotaFormState {
  userId: string;
  monto: number;
  descripcion: string;
  vencimiento: string;
}

export function AdminFinance(): JSX.Element {
  const {
    cuotas,
    summary,
    total,
    isLoading,
    currentPage,
    statusFilter,
    fetchCuotas,
    fetchSummary,
    createCuota,
    markAsPaid,
    filterByStatus,
    goToPage,
  } = useAdminFinance(10);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState<CuotaFormState>({
    userId: "",
    monto: 0,
    descripcion: "",
    vencimiento: "",
  });

  useEffect(() => {
    fetchCuotas();
    fetchSummary();
  }, []);

  const handleOpenDialog = () => {
    setFormState({
      userId: "",
      monto: 0,
      descripcion: "",
      vencimiento: "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCuota(formState);
      handleCloseDialog();
    } catch {
      // Error already handled by hook
    }
  };

  const handleMarkAsPaid = async (cuotaId: string) => {
    try {
      await markAsPaid(cuotaId, {
        fechaPago: new Date().toISOString(),
        metodoPago: "transferencia",
      });
    } catch {
      // Error already handled by hook
    }
  };

  const handleStatusChange = (value: string) => {
    filterByStatus(value === "all" ? "" : value);
  };

  const totalPages = Math.ceil(total / 10);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("es-ES");
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Resumen Financiero */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Ingresos</CardTitle>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalIngresos)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Pendiente</CardTitle>
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalPendiente)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Vencido</CardTitle>
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalVencido)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gestión de Cuotas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Gestión de Cuotas</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Cuota
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Cuota</DialogTitle>
                <DialogDescription>Completa los datos de la cuota</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">ID Miembro</Label>
                  <Input
                    id="userId"
                    value={formState.userId}
                    onChange={(e) => setFormState({ ...formState, userId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto</Label>
                  <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    value={formState.monto}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        monto: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vencimiento">Vencimiento</Label>
                  <Input
                    id="vencimiento"
                    type="date"
                    value={formState.vencimiento}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        vencimiento: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status-filter">Filtrar por Estado</Label>
            <Select value={statusFilter || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagada">Pagada</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Cargando cuotas...</div>
          ) : cuotas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay cuotas registradas</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Miembro</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cuotas.map((cuota) => (
                      <TableRow key={cuota.id}>
                        <TableCell className="font-medium">{cuota.userId}</TableCell>
                        <TableCell>{cuota.descripcion}</TableCell>
                        <TableCell>{formatCurrency(cuota.monto)}</TableCell>
                        <TableCell>{formatDate(cuota.vencimiento)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              cuota.estado === "pagada"
                                ? "bg-green-100 text-green-800"
                                : cuota.estado === "vencida"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {cuota.estado === "pagada"
                              ? "Pagada"
                              : cuota.estado === "vencida"
                                ? "Vencida"
                                : "Pendiente"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {cuota.estado === "pendiente" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsPaid(cuota.id)}
                              className="gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Pagar
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
    </div>
  );
}
