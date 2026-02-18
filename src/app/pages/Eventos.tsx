import { useState } from "react";
import { Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Eventos(): JSX.Element {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // February 2026

  const eventos = [
    {
      id: 1,
      title: "Concierto de Cuaresma",
      date: "2026-03-15",
      time: "19:30",
      location: "Catedral de la Almudena, Madrid",
      description: "Obras sacras de Bach, Palestrina y Victoria. Entrada gratuita.",
      type: "Concierto",
      image: "https://images.unsplash.com/photo-1767426023508-b027ab6b8b6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRoZWRyYWwlMjBjb25jZXJ0JTIwbXVzaWN8ZW58MXx8fHwxNzcxMjg4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: true
    },
    {
      id: 2,
      title: "Réquiem de Mozart",
      date: "2026-03-22",
      time: "20:00",
      location: "Auditorio Nacional de Música",
      description: "Colaboración especial con la Orquesta Sinfónica de Madrid. Dirección: María González.",
      type: "Concierto",
      image: "https://images.unsplash.com/photo-1551696785-927d4ac2d35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmElMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzEyODgzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: true
    },
    {
      id: 3,
      title: "Ensayo General Abierto",
      date: "2026-04-05",
      time: "11:00",
      location: "Sala de Ensayos Armentum",
      description: "Únete a nosotros en nuestro ensayo semanal. Actividad abierta al público.",
      type: "Ensayo",
      image: "https://images.unsplash.com/photo-1657128632843-22dc22049b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9pciUyMHdvcmtzaG9wJTIwcmVoZWFyc2FsfGVufDF8fHx8MTc3MTI4ODM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: true
    },
    {
      id: 4,
      title: "Taller de Técnica Vocal",
      date: "2026-04-12",
      time: "16:00",
      location: "Conservatorio Superior de Madrid",
      description: "Taller intensivo con la soprano internacional Elena Martínez. Plazas limitadas.",
      type: "Taller",
      image: "https://images.unsplash.com/photo-1764176269321-6d14f4af09c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHNpbmdlcnMlMjBjaG9pcnxlbnwxfHx8fDE3NzEyODgzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: true
    },
    {
      id: 5,
      title: "Concierto de Primavera",
      date: "2026-05-10",
      time: "19:00",
      location: "Teatro Real, Madrid",
      description: "Programa variado con obras de Brahms, Debussy y compositores españoles contemporáneos.",
      type: "Concierto",
      image: "https://images.unsplash.com/photo-1761618291331-535983ae4296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzEyMzg2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: false
    },
    {
      id: 6,
      title: "Festival Internacional de Coros",
      date: "2026-06-20",
      time: "Todo el día",
      location: "Varios escenarios, París",
      description: "Participación en el prestigioso Festival de Coros de París junto a agrupaciones de 15 países.",
      type: "Festival",
      image: "https://images.unsplash.com/photo-1662938926048-41f3e3be5484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNhdGhlZHJhbCUyMGludGVyaW9yfGVufDF8fHx8MTc3MTI4ODM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: false
    },
    {
      id: 7,
      title: "Gira de Verano - Alemania",
      date: "2026-07-15",
      time: "Varios horarios",
      location: "Berlín, Múnich, Hamburgo",
      description: "Gira de 10 días por Alemania con presentaciones en catedrales y salas de concierto.",
      type: "Gira",
      image: "https://images.unsplash.com/photo-1610254449353-5698372fa83b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9pciUyMGNvbmNlcnQlMjBoYWxsfGVufDF8fHx8MTc3MTI4ODM2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: false
    },
    {
      id: 8,
      title: "Concierto Benéfico",
      date: "2026-09-18",
      time: "18:30",
      location: "Iglesia de San Jerónimo el Real",
      description: "Concierto benéfico a favor de Cáritas. Todas las recaudaciones serán donadas.",
      type: "Concierto",
      image: "https://images.unsplash.com/photo-1612390179066-5c94fefd48ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBpbnRlcmlvciUyMGNvbmNlcnR8ZW58MXx8fHwxNzcxMjg4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: false
    }
  ];

  const upcomingEvents = eventos.filter(e => new Date(e.date) >= new Date());
  const nextEvents = upcomingEvents.slice(0, 3);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const eventDates = eventos.map(e => new Date(e.date).toDateString());

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const hasEvent = (day: number) => {
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
    return eventDates.includes(dateToCheck);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Concierto": return "bg-red-100 text-red-800";
      case "Ensayo": return "bg-blue-100 text-blue-800";
      case "Taller": return "bg-green-100 text-green-800";
      case "Festival": return "bg-purple-100 text-purple-800";
      case "Gira": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nextEvents.map((evento) => (
              <div key={evento.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <ImageWithFallback 
                    src={evento.image}
                    alt={evento.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getTypeColor(evento.type)}`}>
                      {evento.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-3 text-gray-900">{evento.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {new Date(evento.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{evento.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{evento.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{evento.description}</p>
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Más Información
                  </button>
                </div>
              </div>
            ))}
          </div>
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
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
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
                const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
                const hasEventDay = hasEvent(day);

                return (
                  <div
                    key={day}
                    className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
                      isToday
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : hasEventDay
                        ? 'bg-orange-100 text-orange-900 hover:bg-orange-200'
                        : 'hover:bg-gray-100'
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
          <div className="space-y-6">
            {eventos.map((evento) => (
              <div key={evento.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto bg-gray-200">
                    <ImageWithFallback 
                      src={evento.image}
                      alt={evento.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl text-gray-900">{evento.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ml-4 ${getTypeColor(evento.type)}`}>
                        {evento.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {new Date(evento.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{evento.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{evento.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{evento.description}</p>
                    <div className="flex items-center gap-4">
                      <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Más Información
                      </button>
                      {!evento.available && (
                        <span className="text-sm text-gray-500 italic">Próximamente más detalles</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}