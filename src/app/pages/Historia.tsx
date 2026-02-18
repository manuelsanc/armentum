import { Clock } from "lucide-react";

export function Historia(): JSX.Element {
  const timeline = [
    {
      year: "2003",
      title: "Fundación",
      description: "Nace Estudio Coral Armentum con 15 coristas fundadores bajo la dirección del maestro Carlos Fernández. El objetivo principal era crear un espacio para la música coral de calidad en nuestra comunidad."
    },
    {
      year: "2006",
      title: "Primer Concierto Internacional",
      description: "Realizamos nuestra primera gira internacional por Italia, presentándonos en Florencia, Roma y Venecia. Este logro marcó un hito importante en nuestra trayectoria."
    },
    {
      year: "2010",
      title: "Primer Premio Nacional",
      description: "Obtuvimos el primer premio en el Certamen Nacional de Coros de España, categoría mixta. Este reconocimiento consolidó nuestra posición en el panorama coral nacional."
    },
    {
      year: "2015",
      title: "Expansión del Repertorio",
      description: "Ampliamos nuestro repertorio incorporando obras contemporáneas y encargando composiciones originales a compositores emergentes españoles y latinoamericanos."
    },
    {
      year: "2018",
      title: "Gira Europea",
      description: "Realizamos una extensa gira por 8 países europeos, incluyendo presentaciones en prestigiosas salas de conciertos como el Concertgebouw de Ámsterdam y la Philharmonie de París."
    },
    {
      year: "2020",
      title: "Adaptación Digital",
      description: "Durante la pandemia, innovamos con conciertos virtuales y talleres online, manteniendo viva la actividad coral y llegando a audiencias globales."
    },
    {
      year: "2023",
      title: "20 Aniversario",
      description: "Celebramos dos décadas de música con un concierto especial en el Auditorio Nacional y el lanzamiento de nuestro primer álbum discográfico profesional."
    },
    {
      year: "2026",
      title: "Presente",
      description: "Continuamos creciendo con más de 50 coristas activos, participando en festivales internacionales y promoviendo la música coral entre las nuevas generaciones."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-6">Nuestra Historia</h1>
          <p className="text-xl text-red-100 max-w-3xl">
            Un viaje de más de dos décadas dedicadas a la excelencia musical y la pasión por el canto coral.
          </p>
        </div>
      </section>

      {/* Story Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl mb-6 text-gray-900">El Comienzo</h2>
            <p className="text-gray-700 mb-4">
              Estudio Coral Armentum nació en 2003 de la visión compartida de un grupo de músicos apasionados 
              que soñaban con crear un espacio donde la música coral pudiera florecer con la más alta calidad 
              artística. El nombre "Armentum", del latín "rebaño", fue elegido para simbolizar la unión de 
              voces individuales que se transforman en una sola armonía poderosa y conmovedora.
            </p>
            <p className="text-gray-700 mb-4">
              Desde nuestros humildes comienzos en una pequeña sala de ensayo con apenas 15 coristas, hemos 
              crecido hasta convertirnos en una agrupación de más de 50 miembros, reconocida tanto a nivel 
              nacional como internacional por nuestra calidad vocal, versatilidad interpretativa y compromiso 
              con la excelencia musical.
            </p>
            <p className="text-gray-700">
              A lo largo de estos años, hemos tenido el privilegio de presentarnos en algunos de los escenarios 
              más prestigiosos de Europa, colaborar con directores y compositores de renombre mundial, y sobre 
              todo, compartir la belleza de la música coral con miles de personas en conciertos, festivales y 
              eventos especiales.
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
              <div className="text-4xl text-red-600 mb-4">🏆</div>
              <h3 className="text-xl mb-2 text-gray-900">Premios Nacionales</h3>
              <p className="text-gray-600">5 primeros premios en certámenes nacionales de coros</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="text-4xl text-red-600 mb-4">🌍</div>
              <h3 className="text-xl mb-2 text-gray-900">Presencia Internacional</h3>
              <p className="text-gray-600">Presentaciones en más de 15 países alrededor del mundo</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="text-4xl text-red-600 mb-4">🎵</div>
              <h3 className="text-xl mb-2 text-gray-900">Repertorio Único</h3>
              <p className="text-gray-600">Más de 200 obras en nuestro repertorio activo</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
