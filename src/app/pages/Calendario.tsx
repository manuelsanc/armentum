import { useUpcomingRehearsals } from "../../hooks/useRehearsals";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Loader, Calendar, MapPin, Clock } from "lucide-react";
import { format, parseISO, isPast, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

export function Calendario() {
  const { rehearsals, isLoading, error } = useUpcomingRehearsals();
  const [selectedRehearsalId, setSelectedRehearsalId] = useState<string | null>(null);

  const selectedRehearsal = selectedRehearsalId
    ? rehearsals.find((r) => r.id === selectedRehearsalId)
    : null;

  const getRehearsalStatus = (fecha: string) => {
    const date = parseISO(fecha);
    if (isToday(date))
      return { status: "today", label: "Hoy", color: "bg-blue-50 border-blue-200" };
    if (isPast(date))
      return { status: "past", label: "Pasado", color: "bg-gray-50 border-gray-200" };
    return { status: "future", label: "Próximo", color: "bg-green-50 border-green-200" };
  };

  const upcomingFirst = [...rehearsals].sort((a, b) => {
    const aDate = parseISO(a.fecha);
    const bDate = parseISO(b.fecha);
    return aDate.getTime() - bDate.getTime();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-red-600" />
          <p className="text-gray-600">Cargando calendario de ensayos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-red-600" />
            Calendario de Ensayos
          </h1>
          <p className="text-gray-600">
            {rehearsals.length} ensayo{rehearsals.length !== 1 ? "s" : ""} disponible
            {rehearsals.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {rehearsals.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 text-center">
                No hay ensayos programados en este momento
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {rehearsals.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Rehearsals List */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Ensayos</CardTitle>
                  <CardDescription>Haz clic para ver detalles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingFirst.map((rehearsal) => {
                    const { status, label, color } = getRehearsalStatus(rehearsal.fecha);
                    const isSelected = selectedRehearsalId === rehearsal.id;

                    return (
                      <div
                        key={rehearsal.id}
                        onClick={() => setSelectedRehearsalId(isSelected ? null : rehearsal.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${color} ${
                          isSelected ? "border-red-600 shadow-lg" : "border-current hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{rehearsal.titulo}</h3>
                              <span className="text-xs font-medium px-2 py-1 bg-white rounded-full text-gray-700">
                                {label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rehearsal.descripcion}</p>
                            <div className="flex flex-col gap-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {format(
                                    parseISO(rehearsal.fecha),
                                    "EEEE, d 'de' MMMM 'de' yyyy",
                                    { locale: es }
                                  )}
                                  {" a las "}
                                  {rehearsal.horaInicio}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{rehearsal.lugar}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Detail Panel */}
            <div>
              {selectedRehearsal ? (
                <Card className="sticky top-4 border-red-600 shadow-lg">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-lg text-red-900">Detalles del Ensayo</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Título</p>
                      <p className="text-gray-900 font-semibold">{selectedRehearsal.titulo}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Fecha y Hora</p>
                      <p className="text-gray-900">
                        {format(parseISO(selectedRehearsal.fecha), "EEEE, d 'de' MMMM 'de' yyyy", {
                          locale: es,
                        })}
                      </p>
                      <p className="text-gray-700">
                        Hora: <span className="font-semibold">{selectedRehearsal.horaInicio}</span>
                        {selectedRehearsal.horaFin && (
                          <>
                            {" - "}
                            <span className="font-semibold">{selectedRehearsal.horaFin}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Lugar</p>
                      <p className="text-gray-900">{selectedRehearsal.lugar}</p>
                    </div>

                    {selectedRehearsal.descripcion && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Descripción</p>
                        <p className="text-gray-700">{selectedRehearsal.descripcion}</p>
                      </div>
                    )}

                    {selectedRehearsal.asistentes !== undefined && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Asistentes</p>
                        <p className="text-gray-900 font-semibold">
                          {selectedRehearsal.asistentes} persona
                          {selectedRehearsal.asistentes !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase">Estado</p>
                      <p className="text-gray-900 font-semibold capitalize">
                        {getRehearsalStatus(selectedRehearsal.fecha).label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-600 text-center text-sm">
                      Selecciona un ensayo para ver los detalles
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
