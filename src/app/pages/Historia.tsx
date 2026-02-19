import { Clock } from "lucide-react";

export function Historia(): JSX.Element {
  const timeline = [
    {
      year: "2011",
      title: "Fundación",
      description:
        "Se crea el Estudio Coral Armentum como organización independiente sin fines de lucro, enfocada en el desarrollo sociocultural a través del canto.",
    },
    {
      year: "2014",
      title: "Primeras Giras Internacionales",
      description:
        "Comienzan las giras internacionales con presentaciones en Panamá y México, expandiendo nuestra presencia en Centroamérica.",
    },
    {
      year: "2022",
      title: "Asociación Cultural",
      description:
        "El coro se formaliza como Asociación Cultural Armentum, fortaleciendo su estructura organizativa y proyección.",
    },
    {
      year: "2024",
      title: "Competencia en Barcelona",
      description:
        "Participación en la competencia 'Sing for Gold' en Barcelona, con categorías de música sacra y coro de cámara, más conciertos en Madrid y Barcelona.",
    },
    {
      year: "2025",
      title: "Celebración de los 15 Años",
      description:
        "Preparativos para celebrar 15 años de trayectoria con giras y conciertos especiales. Tributos pop en el Foyer del Teatro Nacional y giras en Tilarán.",
    },
    {
      year: "2026",
      title: "Nueva Gira Internacional",
      description:
        "Anuncio de nueva gira internacional, continuando con la proyección global del coro costarricense.",
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
              El Estudio Coral Armentum es un coro costarricense aficionado con sede en San José,
              fundado en 2011 como organización independiente sin fines de lucro, enfocada en el
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
                    <div className="bg-gray-50 rounded-lg p-6 shadow hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-red-600" />
                        <span className="text-2xl text-red-600">{item.year}</span>
                      </div>
                      <h3 className="text-xl mb-2 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div className="text-4xl text-red-600 mb-4">🏆</div>
              <h3 className="text-xl mb-2 text-gray-900">Sing for Gold 2024</h3>
              <p className="text-gray-600">
                Participación en Barcelona con categorías de música sacra y coro de cámara
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
