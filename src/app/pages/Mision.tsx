import { Target, Heart, Users, Globe, Music } from "lucide-react";

export function Mision(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-6">Nuestra Misión y Valores</h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            Un espacio sociocultural para personas con aptitudes para el canto, fomentando
            herramientas sociales, artísticas y culturales.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-10 h-10 text-red-600" />
              <h2 className="text-3xl text-gray-900">Nuestra Misión</h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Ofrecer un espacio sociocultural para personas con aptitudes para el canto, fomentando
              herramientas sociales, artísticas y culturales.
            </p>
            <p className="text-lg text-gray-700">
              Promovemos la diversidad musical, representando a Costa Rica en eventos
              internacionales con énfasis en la biodiversidad y tradiciones locales.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-10 h-10 text-orange-600" />
              <h2 className="text-3xl text-gray-900">Nuestra Visión</h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Ser un coro costarricense reconocido internacionalmente por su calidad artística,
              diversidad de repertorio y compromiso con la promoción de la cultura costarricense.
            </p>
            <p className="text-lg text-gray-700">
              Continuar representando a Costa Rica en escenarios mundiales, llevando nuestra música
              y tradiciones a nuevos públicos y fortaleciendo los lazos culturales entre naciones.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Diversidad Musical</h3>
              <p className="text-gray-600">
                Repertorio que incluye música sacra, contemporánea, folclórica latina y
                costarricense.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Pasión por el Canto</h3>
              <p className="text-gray-600">
                Coristas de diversas edades, profesiones y orígenes unidos por la pasión por el
                canto.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Comunidad Diversa</h3>
              <p className="text-gray-600">
                Amas de casa, estudiantes, profesionales y personas de distintos oficios formando
                comunidad.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Identidad Nacional</h3>
              <p className="text-gray-600">
                Representando a Costa Rica con énfasis en la biodiversidad y tradiciones locales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Repertoire */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Nuestro Repertorio</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-600">
              <h3 className="text-xl mb-2 text-gray-900">Música Sacra</h3>
              <p className="text-gray-600">
                Obras de compositores como Silvestri y Mendelssohn, que forman parte de la tradición
                coral clásica.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-orange-600">
              <h3 className="text-xl mb-2 text-gray-900">Contemporánea</h3>
              <p className="text-gray-600">
                Obras de compositores modernos como Christopher Tin, explorando nuevos sonidos y
                estilos.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-600">
              <h3 className="text-xl mb-2 text-gray-900">Folclórica Latina y Costarricense</h3>
              <p className="text-gray-600">
                Piezas como "Tico de Corazón" y "El Torito", que celebran nuestra identidad
                nacional.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-orange-600">
              <h3 className="text-xl mb-2 text-gray-900">Pop y Tributos</h3>
              <p className="text-gray-600">
                Arreglos corales de música popular, incluyendo tributos presentados en el Foyer del
                Teatro Nacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-red-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Comparte Nuestra Misión</h2>
          <p className="text-xl mb-8 text-red-100">
            Si te identificas con nuestros valores y quieres ser parte de esta familia coral, te
            invitamos a unirte a nosotros.
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
