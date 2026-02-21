import { useUpcomingRehearsals } from "../../hooks/useRehearsals";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  AlertCircle,
  Loader,
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  parseISO,
  isPast,
  isToday,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { useState, useMemo } from "react";

export function Calendario() {
  const { rehearsals, isLoading, error } = useUpcomingRehearsals();
  const [selectedRehearsalId, setSelectedRehearsalId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const selectedRehearsal = selectedRehearsalId
    ? rehearsals.find((r) => r.id === selectedRehearsalId)
    : null;

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const weekStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday = 0

    return eachDayOfInterval({ start: weekStart, end: monthEnd });
  }, [currentDate]);

  // Group rehearsals by date
  const rehearsalsByDate = useMemo(() => {
    const map = new Map<string, typeof rehearsals>();

    rehearsals.forEach((rehearsal) => {
      const dateKey = rehearsal.fecha;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(rehearsal);
    });

    return map;
  }, [rehearsals]);

  const getRehearsalStatus = (fecha: string) => {
    const date = parseISO(fecha);
    if (isToday(date))
      return { status: "today", label: "Hoy", color: "bg-blue-50 border-blue-200" };
    if (isPast(date))
      return { status: "past", label: "Pasado", color: "bg-gray-50 border-gray-200" };
    return { status: "future", label: "Próximo", color: "bg-green-50 border-green-200" };
  };

  const getTypeBadgeColor = (tipo: string | undefined = ""): string => {
    switch (tipo) {
      case "general":
        return "bg-blue-100 text-blue-800";
      case "seccional":
        return "bg-purple-100 text-purple-800";
      case "otra_actividad":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeLabel = (tipo: string | undefined = ""): string => {
    switch (tipo) {
      case "general":
        return "General";
      case "seccional":
        return "Seccional";
      case "otra_actividad":
        return "Otra Actividad";
      default:
        return tipo || "Otro";
    }
  };

  const upcomingFirst = [...rehearsals].sort((a, b) => {
    const aDate = parseISO(a.fecha);
    const bDate = parseISO(b.fecha);
    return aDate.getTime() - bDate.getTime();
  });

  const monthName = format(currentDate, "MMMM 'de' yyyy", { locale: es });

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
      <div className="max-w-7xl mx-auto px-4">
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
          <div className="flex flex-col gap-6">
            {/* Calendar Section */}
            <Card className="shadow-md">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Calendario Mensual</CardTitle>
                    <CardDescription>Visualiza los ensayos por mes</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Mes anterior"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="min-w-48 text-center font-semibold text-gray-900 capitalize">
                      {monthName}
                    </div>
                    <button
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Próximo mes"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div key={day} className="text-center font-semibold text-gray-700 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 bg-gray-100 p-1 rounded-lg">
                  {calendarDays.map((day, index) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const dayRehearsals = rehearsalsByDate.get(dateStr) || [];
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isDayToday = isToday(day);
                    const isSelected =
                      selectedRehearsal && isSameDay(day, parseISO(selectedRehearsal.fecha));

                    return (
                      <div
                        key={index}
                        className={`min-h-24 p-2 rounded-lg border-2 transition-all ${
                          isDayToday
                            ? "bg-blue-50 border-blue-400 shadow-md"
                            : isCurrentMonth
                              ? "bg-white border-gray-200"
                              : "bg-gray-100 border-gray-200"
                        } ${isSelected ? "ring-2 ring-red-600 ring-offset-0" : ""}`}
                      >
                        {/* Day Number */}
                        <div
                          className={`text-sm font-bold mb-1 ${
                            isCurrentMonth ? "text-gray-900" : "text-gray-400"
                          } ${isDayToday ? "text-blue-700" : ""}`}
                        >
                          {format(day, "d")}
                        </div>

                        {/* Rehearsals in this day */}
                        <div className="space-y-1 overflow-y-auto max-h-16">
                          {dayRehearsals.map((rehearsal) => (
                            <div
                              key={rehearsal.id}
                              onClick={() => setSelectedRehearsalId(rehearsal.id)}
                              className={`text-xs p-1 rounded cursor-pointer transition-all hover:shadow-md truncate ${getTypeBadgeColor(
                                rehearsal.tipo
                              )} ${selectedRehearsalId === rehearsal.id ? "ring-1 ring-red-600" : ""}`}
                              title={`${rehearsal.titulo || rehearsal.nombre} - ${rehearsal.horaInicio || rehearsal.hora || "--:--"}`}
                            >
                              <div className="font-medium truncate">
                                {rehearsal.titulo || rehearsal.nombre}
                              </div>
                              <div className="text-xs opacity-75">
                                {rehearsal.horaInicio || rehearsal.hora || "--:--"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* List and Details Section */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Rehearsals List */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Listado de Ensayos</CardTitle>
                    <CardDescription>
                      Haz clic para ver detalles o seleccionar en el calendario
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingFirst.map((rehearsal) => {
                      const { color } = getRehearsalStatus(rehearsal.fecha);
                      const isSelected = selectedRehearsalId === rehearsal.id;

                      return (
                        <div
                          key={rehearsal.id}
                          onClick={() => setSelectedRehearsalId(isSelected ? null : rehearsal.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${color} ${
                            isSelected
                              ? "border-red-600 shadow-lg"
                              : "border-current hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {rehearsal.titulo || rehearsal.nombre}
                                </h3>
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeBadgeColor(rehearsal.tipo)}`}
                                >
                                  {getTypeLabel(rehearsal.tipo)}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {format(
                                      parseISO(rehearsal.fecha as string),
                                      "EEEE, d 'de' MMMM 'de' yyyy",
                                      { locale: es }
                                    )}
                                    {" a las "}
                                    {rehearsal.horaInicio || rehearsal.hora || "--:--"}
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
                  <Card className="sticky top-4 border-2 border-red-600 shadow-lg overflow-hidden">
                    <CardHeader className="bg-red-50 border-b border-red-100 rounded-t-xl -m-[1px] mb-0 p-4 px-6">
                      <CardTitle className="text-lg text-red-900">Detalles del Ensayo</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Título</p>
                        <p className="text-gray-900 font-semibold">
                          {selectedRehearsal.titulo || selectedRehearsal.nombre}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Tipo</p>
                        <p className="text-gray-900">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(selectedRehearsal.tipo)}`}
                          >
                            {getTypeLabel(selectedRehearsal.tipo)}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Fecha y Hora
                        </p>
                        <p className="text-gray-900">
                          {format(
                            parseISO(selectedRehearsal.fecha),
                            "EEEE, d 'de' MMMM 'de' yyyy",
                            {
                              locale: es,
                            }
                          )}
                        </p>
                        <p className="text-gray-700">
                          Hora:{" "}
                          <span className="font-semibold">
                            {selectedRehearsal.horaInicio || selectedRehearsal.hora}
                          </span>
                          {(selectedRehearsal as any).horaFin && (
                            <>
                              {" - "}
                              <span className="font-semibold">
                                {(selectedRehearsal as any).horaFin}
                              </span>
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
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Descripción
                          </p>
                          <p className="text-gray-700">{selectedRehearsal.descripcion}</p>
                        </div>
                      )}

                      {selectedRehearsal.asistentes !== undefined && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Asistentes
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {selectedRehearsal.asistentes} persona
                            {selectedRehearsal.asistentes !== 1 ? "s" : ""}
                          </p>
                        </div>
                      )}
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
          </div>
        )}
      </div>
    </div>
  );
}
