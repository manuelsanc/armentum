import { useState } from "react";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useEvents } from "../../hooks/useEvents";

export function Eventos(): JSX.Element {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // February 2026
  const [paginationLimit] = useState(20);
  const [paginationOffset, setPaginationOffset] = useState(0);

  const { events: allEvents, loading } = useEvents(paginationLimit, paginationOffset);

  // Get next 3 events for highlights
  const nextEvents = allEvents.slice(0, 3);

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const eventDates = allEvents
    .map((e) => {
      const dateStr = e.fecha || e.date || "";
      try {
        return parseISO(dateStr).toDateString();
      } catch {
        return "";
      }
    })
    .filter(Boolean);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const hasEvent = (day: number) => {
    const dateToCheck = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).toDateString();
    return eventDates.includes(dateToCheck);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "concierto":
        return "bg-red-100 text-red-800";
      case "actividad":
        return "bg-blue-100 text-blue-800";
      case "otro":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "concierto":
        return "Concierto";
      case "actividad":
        return "Actividad";
      case "otro":
        return "Otro";
      default:
        return type || "Evento";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  const formatShortDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  const handleLoadMore = () => {
    setPaginationOffset((prev) => prev + paginationLimit);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-6">Calendario de Eventos</h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            Descubre nuestros próximos conciertos, talleres y actividades. ¡Esperamos verte pronto!
          </p>
        </div>
      </section>

      {/* Next Events Highlights */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Próximos Eventos Destacados</h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : nextEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {nextEvents.map((event) => {
                const eventDate = event.fecha || event.date;
                const eventTime = event.hora || "";
                const eventLocation = event.lugar || event.location || "";
                const eventTitle = event.nombre || event.title || "";
                const eventDescription = event.descripcion || event.description || "";
                const eventType = event.tipo || "Evento";

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getTypeColor(eventType)}`}
                        >
                          {getTypeLabel(eventType)}
                        </span>
                      </div>
                      <h3 className="text-xl mb-3 text-gray-900">{eventTitle}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        {eventDate && (
                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{formatDate(eventDate)}</span>
                          </div>
                        )}
                        {eventTime && (
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{eventTime}</span>
                          </div>
                        )}
                        {eventLocation && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{eventLocation}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600">{eventDescription}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No hay eventos próximos disponibles.</p>
            </div>
          )}
        </div>
      </section>

      {/* Calendar */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Calendario</h2>

          {/* Calendar Header */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h3 className="text-2xl text-gray-900">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="text-center py-2 text-sm text-gray-600">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const isToday =
                  new Date().toDateString() ===
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
                const hasEventDay = hasEvent(day);

                return (
                  <div
                    key={day}
                    className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
                      isToday
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : hasEventDay
                          ? "bg-orange-100 text-orange-900 hover:bg-orange-200"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-sm">{day}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span className="text-gray-600">Hoy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                <span className="text-gray-600">Con evento</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Events List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Todos los Eventos</h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : allEvents.length > 0 ? (
            <>
              <div className="space-y-6">
                {allEvents.map((event) => {
                  const eventDate = event.fecha || event.date;
                  const eventTime = event.hora || "";
                  const eventLocation = event.lugar || event.location || "";
                  const eventTitle = event.nombre || event.title || "";
                  const eventDescription = event.descripcion || event.description || "";
                  const eventType = event.tipo || "Evento";
                  const eventEstado = event.estado || "disponible";

                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-2xl text-gray-900">{eventTitle}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ml-4 ${getTypeColor(
                              eventType
                            )}`}
                          >
                            {getTypeLabel(eventType)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
                          {eventDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span>{formatShortDate(eventDate)}</span>
                            </div>
                          )}
                          {eventTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span>{eventTime}</span>
                            </div>
                          )}
                          {eventLocation && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span>{eventLocation}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600">{eventDescription}</p>
                        {eventEstado && eventEstado !== "disponible" && (
                          <p className="mt-4 text-sm text-gray-500 italic">
                            Próximamente más detalles
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {allEvents.length === paginationLimit && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Cargar más eventos
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No hay eventos disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
