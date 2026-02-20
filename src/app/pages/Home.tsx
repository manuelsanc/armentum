import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Music, Users, Globe } from "lucide-react";
import logo from "../../assets/isotipo_transparent.png";
import { FeatureCard } from "../components/FeatureCard";
import { StatItem } from "../components/StatItem";
import { useEvents } from "../../hooks/useEvents";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const FEATURES = [
  {
    id: 1,
    icon: <Music className="w-8 h-8" />,
    title: "Excelencia Musical",
    description:
      "Repertorio diverso que incluye música sacra, contemporánea, folclórica latina y costarricense.",
    iconBackgroundColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 2,
    icon: <Users className="w-8 h-8" />,
    title: "Comunidad Diversa",
    description:
      "40 coristas de diversas edades, profesiones y orígenes unidos por la pasión por el canto.",
    iconBackgroundColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 3,
    icon: <Calendar className="w-8 h-8" />,
    title: "Trayectoria",
    description: "Más de 150 presentaciones en escenarios de Costa Rica, Panamá, México y España.",
    iconBackgroundColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 4,
    icon: <Globe className="w-8 h-8" />,
    title: "Proyección Internacional",
    description: "Representando a Costa Rica en competencias y festivales internacionales.",
    iconBackgroundColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

const STATS = [
  { value: "~40", label: "Coristas activos" },
  { value: "150+", label: "Conciertos realizados" },
  { value: "2011", label: "Año de fundación" },
  { value: "4", label: "Países visitados" },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "Concierto":
      return "bg-red-100 text-red-800";
    case "Ensayo":
      return "bg-blue-100 text-blue-800";
    case "Taller":
      return "bg-green-100 text-green-800";
    case "Festival":
      return "bg-purple-100 text-purple-800";
    case "Gira":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function Home(): JSX.Element {
  const { events, loading } = useEvents(5);
  const [upcomingEvents, setUpcomingEvents] = useState(events.slice(0, 3));

  useEffect(() => {
    if (events.length > 0) {
      setUpcomingEvents(events.slice(0, 3));
    }
  }, [events]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl mb-6 text-gray-900">
                Bienvenidos a <br />
                <span className="text-red-600">Estudio Coral Armentum</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Un coro costarricense aficionado con sede en San José, comprometido con la
                excelencia musical y la difusión de la cultura coral desde 2011.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/eventos"
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Ver Próximos Eventos
                </Link>
                <Link
                  to="/historia"
                  className="px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Conoce Nuestra Historia
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img src={logo} alt="Logo Armentum" className="w-64 h-64 md:w-80 md:h-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">¿Qué nos define?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconBackgroundColor={feature.iconBackgroundColor}
                iconColor={feature.iconColor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl mb-6 text-gray-900">Sobre Nosotros</h2>
              <p className="text-gray-700 mb-4">
                El Estudio Coral Armentum es un coro costarricense aficionado con sede en San José,
                fundado en 2011 y formalizado como Asociación Cultural Armentum en 2022. Actualmente
                cuenta con alrededor de 40 integrantes de diversas edades, profesiones y orígenes,
                dirigidos por Albin Delgado.
              </p>
              <p className="text-gray-700 mb-6">
                Nuestra misión es ofrecer un espacio sociocultural para personas con aptitudes para
                el canto, fomentando herramientas sociales, artísticas y culturales. Promovemos la
                diversidad musical, representando a Costa Rica en eventos internacionales con
                énfasis en la biodiversidad y tradiciones locales.
              </p>
              <Link
                to="/historia"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Leer Más
              </Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl mb-4 text-gray-900">Datos Destacados</h3>
              <div className="space-y-4">
                {STATS.map((stat, index) => (
                  <StatItem key={index} value={stat.value} label={stat.label} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Eventos Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl text-gray-900">Próximos Eventos</h2>
            <Link
              to="/eventos"
              className="text-red-600 hover:text-red-700 transition-colors font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => {
                const eventDate = event.fecha || event.date;
                const eventLocation = event.lugar || event.location || "";
                const eventTitle = event.nombre || event.title || "";
                const eventDescription = event.descripcion || event.description || "";
                const eventType = event.tipo || "Evento";
                const eventImage =
                  event.imagen_url ||
                  "https://images.unsplash.com/photo-1610254449353-5698372fa83b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
                  >
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      <ImageWithFallback
                        src={eventImage}
                        alt={eventTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getTypeColor(eventType)}`}
                        >
                          {eventType}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                        {eventTitle}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        {eventDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>
                              {new Date(eventDate).toLocaleDateString("es-ES", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                        {eventLocation && (
                          <div className="flex items-center gap-2 truncate">
                            <span className="flex-shrink-0">📍</span>
                            <span className="truncate text-xs">{eventLocation}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{eventDescription}</p>
                      <Link
                        to="/eventos"
                        className="inline-block w-full text-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Más Información
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No hay eventos próximos en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">¿Te gustaría unirte a nosotros?</h2>
          <p className="text-xl mb-8 text-red-100">
            Siempre estamos abiertos a nuevos talentos que compartan nuestra pasión por la música
            coral.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://facebook.com/estudiocoralarmentum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/armentum.estudio.coral"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
