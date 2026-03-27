import { Clock } from "lucide-react";
import sagradaFamilia from "../../assets/sagrada_familia.jpg";
import conciertoPop from "../../assets/pop_2025.jpg";
import giraColombia from "../../assets/gira_colombia.jpg";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
}

export function Historia(): JSX.Element {
  const timeline: TimelineItem[] = [
    {
      year: "2011",
      title: "Fundación",
      description:
        "Se crea el Estudio Coral Armentum como organización independiente sin fines de lucro en San José, Costa Rica, enfocada en el desarrollo sociocultural a través del canto.",
    },
    {
      year: "2018",
      title: "Primera Gira Internacional - Panamá",
      description:
        "Como parte del segundo Encuentro Latinoamericano de Música Coral 'ELAMCO', en ciudad de Panamá.",
    },
    {
      year: "2019",
      title: "Segunda Gira Internacional - México",
      description:
        "Como parte del segundo festival internacional 'Voces por la paz', llevado a cabo en ciudad de Monterrey, Nuevo León, México.",
    },
    {
      year: "2022",
      title: "Asociación Coral Armentum",
      description:
        "El coro concluye el proceso para constituirse formalmente como Asociación Coral Armentum, fortaleciendo su estructura organizativa y proyección.",
    },
    {
      year: "2022",
      title: "Conciertos y Festivales Nacionales",
      description:
        "V Festival Coral Nacional, organizado por ACDA Costa Rica. Concierto Voces de Esperanza, parte de la temporada de presentaciones del coro.",
    },
    {
      year: "2023",
      title: "Sunrise Mass (Ola Gjeilo)",
      description:
        "Presentación especial de la obra Sunrise Mass, del compositor noruego Ola Gjeilo, una de las piezas más destacadas del repertorio contemporáneo del coro. Contó con la participación del Coro Municipal de San Rafael y la orquesta de cuerdas de la Escuela Música de Paraíso 'EMUSPAR'.",
      location:
        "Basílica de los Ángeles (Cartago), Parroquia San Rafael de Heredia, Iglesia La Soledad",
    },
    {
      year: "2023",
      title: "Conciertos y Festivales Nacionales",
      description:
        "Participación en el Festival Christus est Natus, celebrando la temporada navideña con repertorio sacro y contemporáneo. VI Festival Coral Nacional de ACDA Costa Rica (Moravia).",
    },
    {
      year: "2024",
      title: "Gira España — Madrid, Calella y Barcelona",
      description:
        "Conciertos en escenarios como la Cripta de la Basílica de la Sagrada Familia en Barcelona, Auditorio Gabriela Mistral (Casa de America) y Catedral Anglicana del Redentor en Madrid.",
      location: "Madrid y Barcelona",
    },
    {
      year: "2024",
      title: "Sing for Gold — Calella",
      description:
        "Participación en la competencia coral internacional Sing for Gold en Barcelona, en la cual Armentum gana dos medallas de plata en las categorías Música de Cámara y Música Sacra.",
      location: "Calella, Barcelona",
      image: sagradaFamilia,
    },
    {
      year: "2025",
      title: "Conciertos y Festivales Nacionales",
      description:
        "4to Festival Esperanza Ambiental. 1er Concierto Internacional & III Festival Coral UCR. 3er Festival Internacional de Coros Femeninos (FICFE). 8vo Festival Coral Nacional ACDA. RIDE Cultural (Ministerio de Cultura y Deporte): Teatro Nacional y otros escenarios de San José Centro.",
      location: "San José, Costa Rica",
    },
    {
      year: "2025",
      title: "Gira Nacional “Concierto POP”",
      description:
        "Conciertos de música popular con repertorio de canciones de los 60s, 70s, 80s y 90s, en colaboración con municipalidades y asociaciones de desarrollo comunal en varias comunidades fuera del Valle Central.",
      location: "Desamparados, Dota, Pérez Zeledón, La Fortuna, Grecia, Tilarán",
      image: conciertoPop,
    },
    {
      year: "2026",
      title: "Gira Internacional - Colombia",
      description:
        "Gira internacional por Colombia de conciertos independientes y de intercambio cultural, con presentaciones en Medellín, expandiendo la presencia del coro en Sudamérica.",
      location: "Medellín, Colombia",
      image: giraColombia,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-6">Nuestra Historia</h1>
          <p className="text-xl text-red-100 max-w-3xl">
            Más de una década dedicados a la excelencia musical y la pasión por el canto coral,
            representando a Costa Rica en escenarios internacionales.
          </p>
        </div>
      </section>

      {/* Story Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl mb-6 text-gray-900">El Comienzo</h2>
            <p className="text-gray-700 mb-4">
              El Estudio Coral Armentum es un coro costarricense fundado en 2011 con sede en San
              José, como una organización independiente sin fines de lucro, enfocada en el
              desarrollo sociocultural a través del canto.
            </p>
            <p className="text-gray-700 mb-4">
              En 2022, el coro se convirtió en asociación cultural formal, fortaleciendo su
              estructura organizativa. Para 2025-2026, planea celebrar sus 15 años con giras y
              conciertos especiales.
            </p>
            <p className="text-gray-700">
              A lo largo de su trayectoria, ha realizado más de 150 presentaciones en escenarios
              clave de Costa Rica, Panamá, México y España, bajo la dirección de Albin Delgado.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Cronología</h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-red-200"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-start ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow -ml-2"></div>

                  {/* Content */}
                  <div
                    className={`ml-16 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                      {/* Imagen si existe */}
                      {item.image && (
                        <div
                          className={`${
                            item.title === "4to Festival Esperanza Ambiental" ||
                            item.title === "Concierto POP — Municipalidad de Dota"
                              ? "h-80"
                              : item.title ===
                                  "1er Concierto Internacional & III Festival Coral UCR"
                                ? "h-96"
                                : item.title === "Nueva Gira Internacional - Colombia"
                                  ? "h-[600px]"
                                  : "h-56"
                          } overflow-hidden`}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-5 h-5 text-red-600" />
                          <span className="text-2xl text-red-600">{item.year}</span>
                        </div>
                        <h3 className="text-xl mb-2 text-gray-900">{item.title}</h3>
                        {item.location && (
                          <p className="text-sm text-orange-600 mb-2 flex items-center gap-1">
                            <span>📍</span> {item.location}
                          </p>
                        )}
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Logros Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="text-4xl text-red-600 mb-4">🎤</div>
              <h3 className="text-xl mb-2 text-gray-900">Conciertos</h3>
              <p className="text-gray-600">
                Más de 150 presentaciones nacionales e internacionales
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="text-4xl text-red-600 mb-4">🌍</div>
              <h3 className="text-xl mb-2 text-gray-900">Giras Internacionales</h3>
              <p className="text-gray-600">Panamá, México, España (Barcelona y Madrid)</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="text-4xl text-red-600 mb-4">🏅</div>
              <h3 className="text-xl mb-2 text-gray-900">Mejor proyecto musical - cultural</h3>
              <p className="text-gray-600">
                Ganadores del primer lugar en mejor proyecto musical - cultural en Ciudad de Panamá
                2018
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="text-4xl text-red-600 mb-4">🏆</div>
              <h3 className="text-xl mb-2 text-gray-900">Sing for Gold 2024</h3>
              <p className="text-gray-600">
                Participación en Barcelona, ganadores de dos medallas de plata en las categorías
                Música de Cámara y Música Sacra.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
