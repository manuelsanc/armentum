import { useAttendance } from "../../hooks/useAttendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Loader, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function MisAsistencias() {
  const { attendance, stats, isLoading, error } = useAttendance();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-red-600" />
          <p className="text-gray-600">Cargando información de asistencias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Asistencias</h1>
          <p className="text-gray-600">Registro de tu participación en ensayos</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Ensayos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRehearsals}</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Asistencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-700">{stats.attended}</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Inasistencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Justificadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-700">{stats.justified}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Percentage */}
        {stats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Porcentaje de Asistencia</CardTitle>
              <CardDescription>Tu rendimiento en los ensayos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Tasa de Asistencia</span>
                  <span className="text-3xl font-bold text-red-600">
                    {stats.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={stats.percentage} className="h-3" />
              </div>
              <p className="text-sm text-gray-600">
                Has asistido a {stats.attended} de {stats.totalRehearsals} ensayos
              </p>
            </CardContent>
          </Card>
        )}

        {/* Attendance List */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Asistencias</CardTitle>
            <CardDescription>
              {attendance.length} registro{attendance.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendance.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay registros de asistencia</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Fecha</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Ensayo</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Estado</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Justificación
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record) => (
                      <tr
                        key={record.id}
                        className={`border-b border-gray-200 ${
                          record.presente
                            ? "bg-green-50 hover:bg-green-100"
                            : "bg-red-50 hover:bg-red-100"
                        } transition-colors`}
                      >
                        <td className="px-4 py-4">
                          {format(
                            parseISO(record.rehearsal?.fecha || ""),
                            "d 'de' MMMM 'de' yyyy",
                            { locale: es }
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {record.rehearsal?.titulo || "Ensayo"}
                            </p>
                            <p className="text-xs text-gray-600">{record.rehearsal?.lugar}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                              record.presente
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {record.presente ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Presente
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Ausente
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {record.justificacion ? (
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-700">{record.justificacion}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
