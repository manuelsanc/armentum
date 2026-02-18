import { Link } from "react-router";
import { Calendar, Music, Users, Award } from "lucide-react";
import logo from "../../assets/isotipo_transparent.png";
import { FeatureCard } from "../components/FeatureCard";
import { StatItem } from "../components/StatItem";

const FEATURES = [
  {
    id: 1,
    icon: <Music className="w-8 h-8" />,
    title: "Excelencia Musical",
    description:
      "Repertorio diverso que abarca desde la música clásica hasta obras contemporáneas.",
    iconBackgroundColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 2,
    icon: <Users className="w-8 h-8" />,
    title: "Comunidad",
    description: "Más que un coro, somos una familia unida por la pasión por la música.",
    iconBackgroundColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 3,
    icon: <Calendar className="w-8 h-8" />,
    title: "Eventos Regulares",
    description: "Conciertos, talleres y presentaciones durante todo el año.",
    iconBackgroundColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 4,
    icon: <Award className="w-8 h-8" />,
    title: "Trayectoria",
    description: "Más de 20 años de experiencia en la escena coral nacional e internacional.",
    iconBackgroundColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

const STATS = [
  { value: "50+", label: "Coristas activos" },
  { value: "100+", label: "Conciertos realizados" },
  { value: "20+", label: "Años de trayectoria" },
  { value: "15+", label: "Países visitados" },
];

export function Home(): JSX.Element {
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
                Una agrupación coral comprometida con la excelencia musical y la difusión de la
                cultura coral.
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
              <img
                src={logo}
                alt="Logo Armentum"
                className="w-64 h-64 md:w-80 md:h-80"
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
                Estudio Coral Armentum nace en 2003 con la visión de crear un espacio donde la
                música coral pudiera florecer y desarrollarse con la más alta calidad artística.
                Nuestro nombre, inspirado en el latín "armentum" (rebaño), representa la unión de
                voces individuales que se convierten en una sola armonía.
              </p>
              <p className="text-gray-700 mb-6">
                A lo largo de los años, hemos crecido hasta convertirnos en una de las agrupaciones
                corales más reconocidas de la región, manteniendo siempre nuestro compromiso con la
                excelencia y la pasión por la música.
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

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">¿Te gustaría unirte a nosotros?</h2>
          <p className="text-xl mb-8 text-red-100">
            Siempre estamos abiertos a nuevos talentos que compartan nuestra pasión por la música
            coral.
          </p>
          <a
            href="mailto:info@armentum.org"
            className="inline-block px-8 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contáctanos
          </a>
        </div>
      </section>
    </div>
  );
}
