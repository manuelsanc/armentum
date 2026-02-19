import { useFinance } from "../../hooks/useFinance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Loader, DollarSign, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function Finanzas() {
  const { cuotas, history, summary, isLoading, error } = useFinance();

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pagada":
        return "bg-green-50 border-green-200";
      case "vencida":
        return "bg-red-50 border-red-200";
      case "pendiente":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "pagada":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "vencida":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "pendiente":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "pagada":
        return "Pagada";
      case "vencida":
        return "Vencida";
      case "pendiente":
        return "Pendiente";
      default:
        return estado;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-red-600" />
          <p className="text-gray-600">Cargando información financiera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Finanzas</h1>
          <p className="text-gray-600">Gestiona tus cuotas y pagos</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total Pendiente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  $
                  {summary.totalPendiente.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Total Vencido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  $
                  {summary.totalVencido.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Total Pagado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  $
                  {summary.totalPagado.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cuotas Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mis Cuotas</CardTitle>
            <CardDescription>
              {cuotas.length} cuota{cuotas.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cuotas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay cuotas registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Descripción</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Monto</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Vencimiento</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuotas.map((cuota) => (
                      <tr
                        key={cuota.id}
                        className={`border-b border-gray-200 ${getEstadoColor(
                          cuota.estado
                        )} transition-colors hover:bg-opacity-50`}
                      >
                        <td className="px-4 py-4">{cuota.descripcion}</td>
                        <td className="px-4 py-4 font-semibold">
                          $
                          {cuota.monto.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-4">
                          {format(parseISO(cuota.vencimiento), "d 'de' MMMM 'de' yyyy", {
                            locale: es,
                          })}
                        </td>
                        <td className="px-4 py-4">
                          <span className="flex items-center gap-2">
                            {getEstadoIcon(cuota.estado)}
                            <span className="font-medium">{getEstadoLabel(cuota.estado)}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History Section */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>
              {history.length} pago{history.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay pagos registrados</p>
            ) : (
              <div className="space-y-4">
                {history.map((pago) => (
                  <div
                    key={pago.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Pago de $
                        {pago.monto.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(parseISO(pago.fechaPago), "d 'de' MMMM 'de' yyyy", {
                          locale: es,
                        })}{" "}
                        • Método: <span className="font-medium">{pago.metodoPago}</span>
                      </p>
                      {pago.referencia && (
                        <p className="text-xs text-gray-500 mt-1">Referencia: {pago.referencia}</p>
                      )}
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 ml-4" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
