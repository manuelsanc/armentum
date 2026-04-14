import { Link } from "react-router";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Music,
  Users,
  Globe,
  Award,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import follerTeatroNacional from "../../assets/foller_teatro_nacional.jpg";
import directorImagen from "../../assets/director.jpeg";
import { FeatureCard } from "../components/FeatureCard";
import { StatItem } from "../components/StatItem";
import { JoinChoirModal } from "../components/JoinChoirModal";
import { useEvents } from "../../hooks/useEvents";

// Importar imágenes de coristas
import adrianaGuillen from "../../assets/coristas/adriana_guillen.jpg";
import dilanaArce from "../../assets/coristas/diana_arce.jpg";
import lauraMunoz from "../../assets/coristas/laura_munoz.jpg";
import giovannaChacon from "../../assets/coristas/giovanna_chacon.jpg";
import katiaCalderon from "../../assets/coristas/katia_calderon.jpg";
import lauraAlvarado from "../../assets/coristas/laura_alvarado.jpg";
import lauraMora from "../../assets/coristas/laura_mora.jpg";
import naomiBedoya from "../../assets/coristas/naomi_bedoya.jpg";
import stevenGutierrez from "../../assets/coristas/steven_gutierrez.jpg";
import leonardoDeLeon from "../../assets/coristas/leonardo_de_leon.jpg";
import marioCalderon from "../../assets/coristas/mario_calderon.jpg";
import marioAraya from "../../assets/coristas/mario_araya.jpg";
import joseSolorzano from "../../assets/coristas/jose_solorzano.jpg";
import marcoBolanos from "../../assets/coristas/marco_bolanos.jpg";
import marcoMata from "../../assets/coristas/marco_mata.jpg";
import vanessaSanchez from "../../assets/coristas/vanessa_sanchez.jpg";
import fabiolaAlvarado from "../../assets/coristas/fabiola_alvarado.jpg";
import odilieGomez from "../../assets/coristas/odilie_gomez.jpg";
import karlaCeciliano from "../../assets/coristas/karla_siciliano.jpg";
import eduardoBonilla from "../../assets/coristas/eduardo_bonilla.jpg";
import dennisCantillo from "../../assets/coristas/dennis_cantillo.jpg";
import manuelSanchez from "../../assets/coristas/manuel_sanchez.jpg";
import hectorCastro from "../../assets/coristas/hector_castro.jpg";
import marcelaAraya from "../../assets/coristas/marcela_araya.jpg";
import jeffrySolis from "../../assets/coristas/jeffry_solis.jpg";
import joelBermudez from "../../assets/coristas/joel_bermudez.jpg";

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
      "Más de 30 coristas de diversas edades, profesiones y orígenes unidos por la pasión por el canto.",
    iconBackgroundColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 3,
    icon: <Award className="w-8 h-8" />,
    title: "Trayectoria",
    description:
      "Más de 150 conciertos y presentaciones en escenarios de Costa Rica, Panamá, México y España.",
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
  { value: "30+", label: "Coristas" },
  { value: "150+", label: "Conciertos realizados" },
  { value: "2011", label: "Año de fundación" },
  { value: "4", label: "Países visitados" },
];

interface Corista {
  nombre: string;
  foto?: string;
}

interface Voz {
  nombre: string;
  coristas: Corista[];
}

const placeHolder = "";

const VOCES: Voz[] = [
  {
    nombre: "Sopranos",
    coristas: [
      { nombre: "Laura Violeta Alvarado Ulate", foto: lauraAlvarado },
      { nombre: "Diana Carolina Alfaro Mata", foto: placeHolder },
      { nombre: "Marcela Araya Esquivel", foto: marcelaAraya },
      { nombre: "Dilana Arce Vega", foto: dilanaArce },
      { nombre: "Kattia Vanessa Calderón Agüero", foto: katiaCalderon },
      { nombre: "Giovanna Chacón Barrera", foto: giovannaChacon },
      { nombre: "Naomy María Bedoya Madrigal", foto: naomiBedoya },
      { nombre: "Andrea Guillén Meléndez", foto: adrianaGuillen },
      { nombre: "Laura Angélica Muñoz Umaña", foto: lauraMora },
      { nombre: "Laura Mora Vargas", foto: lauraMunoz },
    ],
  },
  {
    nombre: "Tenores",
    coristas: [
      { nombre: "Mario Esteban Araya Marchena", foto: marioAraya },
      { nombre: "Joel José Bermudez Sanabria", foto: joelBermudez },
      { nombre: "Héctor Francisco Castro Castillo", foto: hectorCastro },
      { nombre: "Mario Esteban Calderón Vargas", foto: marioCalderon },
      { nombre: "Leonardo Jesus De Leon Aguilar", foto: leonardoDeLeon },
      { nombre: "Steven Gutiérrez Zúñiga", foto: stevenGutierrez },
      { nombre: "Jeffry Solís Picado", foto: jeffrySolis },
      { nombre: "Erick Josué Zúñiga Zúñiga", foto: placeHolder },
    ],
  },
  {
    nombre: "Contraltos",
    coristas: [
      { nombre: "Fabiola Alvarado Ulate", foto: fabiolaAlvarado },
      { nombre: "Karla Ceciliano Zamora", foto: karlaCeciliano },
      { nombre: "Johanna Dinarte Segura", foto: placeHolder },
      { nombre: "Amanda Garita Matamoros", foto: placeHolder },
      { nombre: "Odilie Ma Gomez Orozco", foto: odilieGomez },
      { nombre: "Cindy Vanessa Sánchez Villalta", foto: vanessaSanchez },
      { nombre: "Stephanie Paola Tenorio Alvarado", foto: placeHolder },
    ],
  },
  {
    nombre: "Bajos",
    coristas: [
      { nombre: "Marco Antonio Bolaños García", foto: marcoBolanos },
      { nombre: "Dennis Cantillo Morúa", foto: dennisCantillo },
      { nombre: "José Eduardo Jarquín Bonilla", foto: eduardoBonilla },
      { nombre: "Marco Antonio Mata Estrada", foto: marcoMata },
      { nombre: "Manuel Sánchez Ordóñez", foto: manuelSanchez }, // Usando foto de Steven como placeholder
      { nombre: "José Miguel Solórzano Enríquez", foto: joseSolorzano },
    ],
  },
];

export function Home(): JSX.Element {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { events: allEvents, loading: eventsLoading } = useEvents(50, 0);

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const upcomingEvents = allEvents
    .map((event) => {
      const dateStr = event.fecha || event.date || "";
      try {
        return { event, date: parseISO(dateStr) };
      } catch {
        return { event, date: null };
      }
    })
    .filter((item) => item.date && item.date >= startOfToday)
    .sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0))
    .slice(0, 3);

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

  const hasEvent = (day: number) => {
    const dateToCheck = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).toDateString();
    return eventDates.includes(dateToCheck);
  };

  const formatShortDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

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
                Un coro costarricense con sede en San José, que desde el 2011 ha estado comprometido
                con la excelencia musical y la difusión de la cultura coral.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/historia"
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Ver Historia
                </Link>
                <Link
                  to="/mision"
                  className="px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Misión y Valores
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full">
              <img
                src={follerTeatroNacional}
                alt="Teatro Nacional"
                className="w-full max-w-2xl h-64 md:h-96 object-cover rounded-xl shadow-md"
              />
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
                El Estudio Coral Armentum es un coro costarricense con sede en San José, fundado en
                el 2011 y formalizado como Asociación Coral Armentum en 2022. Actualmente cuenta con
                más de 30 integrantes de diversas edades, profesiones y orígenes, dirigidos por el
                maestro Albin Delgado Torres.
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

      {/* Director Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Sobre el Director</h2>
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
            {/* Foto del director - rectangular */}
            <div className="flex-shrink-0">
              <div className="w-64 h-80 bg-gray-200 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={directorImagen}
                  alt="Albin Delgado Torres, Director"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/src/assets/isotipo.png";
                  }}
                />
              </div>
            </div>
            {/* Texto */}
            <div>
              <h3 className="text-2xl mb-2 text-gray-900">Albin Delgado Torres</h3>
              <p className="text-red-600 mb-4 font-medium">Director</p>
              <p className="text-gray-700 leading-relaxed">
                Inicia sus estudios musicales en la Universidad Nacional de Costa Rica en el año
                2008, especializándose en Pedagogía Musical y Dirección Coral. Ha profundizado su
                formación bajo la tutela de importantes directores del mundo como Hanz Peters
                Shurtz, Javier Busto y Vytautas Miškinis, entre otros. Como instrumentista, cantante
                y director ha representado a Costa Rica en prestigiosos festivales y competencias en
                Alemania, Austria, Gales, Inglaterra, Italia, España, Panamá, Nicaragua, Guatemala,
                México y Estados Unidos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coristas Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-4 text-gray-900">Nuestros Coristas</h2>
          <p className="text-center text-gray-600 mb-12">
            Más de 30 voces unidas por la pasión por el canto
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {VOCES.map((voces, vocesIndex) => (
              <div key={vocesIndex} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl text-center mb-6 text-red-600 font-semibold">
                  {voces.nombre}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {voces.coristas.map((corista, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div className="w-[125px] h-[125px] rounded-full bg-black overflow-hidden border-2 border-black/40 shadow">
                        {corista.foto ? (
                          <img
                            src={corista.foto}
                            alt={corista.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-black flex items-center justify-center">
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 48 48"
                              className="w-12 h-12 text-white/70"
                            >
                              <path
                                fill="currentColor"
                                d="M24 24c5.523 0 10-4.477 10-10S29.523 4 24 4s-10 4.477-10 10 4.477 10 10 10Zm0 4c-9.389 0-17 5.373-17 12v4h34v-4c0-6.627-7.611-12-17-12Z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-center text-gray-600 font-medium leading-tight">
                        {corista.nombre}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendario y Próximos Eventos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl text-gray-900">Próximos Eventos</h2>
            <Link
              to="/eventos"
              className="text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              Ver todos los eventos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,260px)_1fr] gap-8">
            {/* Calendario compacto */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                    )
                  }
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <h3 className="text-sm font-semibold text-gray-900">
                  {format(currentMonth, "MMMM yyyy", { locale: es })}
                </h3>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                    )
                  }
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-500 mb-2">
                {"DLMMJVS".split("").map((day, index) => (
                  <div key={`${day}-${index}`} className="text-center">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="h-7" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const isToday =
                    new Date().toDateString() ===
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    ).toDateString();
                  const hasEventDay = hasEvent(day);

                  return (
                    <div
                      key={day}
                      className={`h-7 w-7 text-xs flex items-center justify-center rounded-md transition-colors ${
                        isToday
                          ? "bg-red-600 text-white"
                          : hasEventDay
                            ? "bg-orange-100 text-orange-900"
                            : "hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-600 rounded" />
                  Hoy
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded" />
                  Con evento
                </div>
              </div>
            </div>

            {/* Lista de próximos eventos */}
            <div className="space-y-4">
              {eventsLoading ? (
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                  Cargando eventos...
                </div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map(({ event }) => {
                  const eventDate = event.fecha || event.date || "";
                  const eventTime = event.hora || "";
                  const eventLocation = event.lugar || event.location || "";
                  const eventTitle = event.nombre || event.title || "Evento";

                  return (
                    <div
                      key={event.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <h3 className="text-lg text-gray-900 mb-2">{eventTitle}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        {eventDate && (
                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{formatShortDate(eventDate)}</span>
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
                    </div>
                  );
                })
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-3">
                    No hay eventos próximos disponibles en este momento.
                  </p>
                  <Link
                    to="/eventos"
                    className="text-red-600 font-medium hover:text-red-700 transition-colors"
                  >
                    Ver el calendario completo
                  </Link>
                </div>
              )}
            </div>
          </div>
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
            <JoinChoirModal />
          </div>
        </div>
      </section>
    </div>
  );
}
