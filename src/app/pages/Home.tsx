import { Link } from "react-router";
import { Music, Users, Globe, Award } from "lucide-react";
import logo from "../../assets/isotipo_transparent.png";
import { FeatureCard } from "../components/FeatureCard";
import { StatItem } from "../components/StatItem";

// Importar imágenes de coristas
import adrianaGuillen from "../../assets/coristas/adriana_guillen.jpg";
import dianaArce from "../../assets/coristas/diana_arce.jpg";
import lauraMunoz from "../../assets/coristas/laura_munoz.jpg";
import giovannaChacon from "../../assets/coristas/giovanna_chacon.jpg";
import katiaCalderon from "../../assets/coristas/katia_calderon.jpg";
import lauraAlvarado from "../../assets/coristas/laura_alvarado.jpg";
import lauraMora from "../../assets/coristas/laura_mora.jpg";
import naomiBedoya from "../../assets/coristas/naomi_bedoya.jpg";
import stevenGutierrez from "../../assets/coristas/steven_gutierrez.jpg";
import manuelSanchez from "../../assets/coristas/manuel_sanchez.jpg";
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
      "31 coristas de diversas edades, profesiones y orígenes unidos por la pasión por el canto.",
    iconBackgroundColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 3,
    icon: <Award className="w-8 h-8" />,
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
  { value: "~31", label: "Coristas activos" },
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

const VOCES: Voz[] = [
  {
    nombre: "Sopranos",
    coristas: [
      { nombre: "Laura Alvarado Ulate", foto: lauraAlvarado },
      { nombre: "Dilana Arce Vega", foto: dianaArce },
      { nombre: "Katia Calderón Agüero", foto: katiaCalderon },
      { nombre: "Giovanna Chacón Barrera", foto: giovannaChacon },
      { nombre: "Naomy Gedoya Madrigal", foto: naomiBedoya },
      { nombre: "Adriana Guillen Melendez", foto: adrianaGuillen },
      { nombre: "Laura Mora Vargas", foto: lauraMora },
      { nombre: "Laura Muñoz Umaña", foto: lauraMunoz },
    ],
  },
  {
    nombre: "Tenores",
    coristas: [
      { nombre: "Mario Araya Marchena", foto: marioAraya },
      { nombre: "Mario Calderón Vargas", foto: marioCalderon },
      { nombre: "Héctor Castro Castillo", foto: joseSolorzano }, // Usando foto de José Solozano como placeholder
      { nombre: "Leonardo De León Aguilar", foto: leonardoDeLeon },
      { nombre: "Steven Gutiérrez Zúñiga", foto: stevenGutierrez },
    ],
  },
  {
    nombre: "Contraltos",
    coristas: [
      { nombre: "Fabiola Alvarado Ulate", foto: fabiolaAlvarado },
      { nombre: "Karla Ceciliano Zamora", foto: karlaCeciliano },
      { nombre: "Odilie Gómez Orozco", foto: odilieGomez },
      { nombre: "Vanessa Sánchez Villalta", foto: vanessaSanchez },
    ],
  },
  {
    nombre: "Bajos",
    coristas: [
      { nombre: "Marco Bolaños García", foto: marcoBolanos },
      { nombre: "Dennis Cantillo Morua", foto: dennisCantillo },
      { nombre: "Eduardo Jarquin Bonilla", foto: eduardoBonilla },
      { nombre: "Marco Mata Estrada", foto: marcoMata },
      { nombre: "Manuel Sánchez Ordóñez", foto: manuelSanchez }, // Usando foto de Steven como placeholder
      { nombre: "José Solozano", foto: joseSolorzano },
    ],
  },
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
                Un coro costarricense aficionado con sede en San José, comprometido con la
                excelencia musical y la difusión de la cultura coral desde 2011.
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

      {/* Director Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Sobre el Director</h2>
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
            {/* Foto del director - rectangular */}
            <div className="flex-shrink-0">
              <div className="w-64 h-80 bg-gray-200 overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://lh3.googleusercontent.com/sitesv/APaQ0SQjzsYowRogCdGB3tOEkKESlCypqQUkoAdVWbaKeELErlV_TVnZF4nEGTzbdk4wyP3n9wcIfpcIE0eiRWa5lf-BJJqU_f4hsESpiDS5g7R2Hol4rMS3a8R8RqUWAWd8kLnrHms_qirlWAR7D0G28T2AblK072yeHW1ZVwWc9UUs0f2ARxwIPi_odzrJATEY0l_PYY5LLTCt5NNA_hvHGZ3qfL_keZhmbpZymRk=w1280"
                  alt="Albin Delgado, Director"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/src/assets/isotipo.png";
                  }}
                />
              </div>
            </div>
            {/* Texto */}
            <div>
              <h3 className="text-2xl mb-2 text-gray-900">Albin Delgado</h3>
              <p className="text-red-600 mb-4 font-medium">Director</p>
              <p className="text-gray-700 leading-relaxed">
                Inicia sus estudios musicales en la Universidad Nacional de Costa Rica en el año
                2008, especializándose en Pedagogía Musical y Dirección Coral. Ha profundizado su
                formación bajo la tutela de importantes directores del mundo como Hanz Peters
                Shurtz, Javier Busto y Vytautas Miškinis, entre otros. Como instrumentista, cantante
                y director ha representado a Costa Rica en prestigiosos festivales y competencias en
                Panamá, Nicaragua, Guatemala, México, Estados Unidos, Alemania, Austria, Gales,
                Inglaterra, Italia y España.
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
            ~40 voces unidas por la pasión por el canto
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
                      <div className="w-[125px] h-[125px] rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300 shadow">
                        {corista.foto ? (
                          <img
                            src={corista.foto}
                            alt={corista.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                            <span className="text-xl text-red-400">♪</span>
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
