import { Target, Heart, Star, Users, Lightbulb, Globe } from "lucide-react";

export function Mision(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-6">Nuestra Misión y Valores</h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            Trabajamos cada día para promover la excelencia musical y compartir la belleza de la música coral con el mundo.
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
              La misión de Estudio Coral Armentum es cultivar y promover la excelencia en la música coral, 
              proporcionando a nuestros miembros un espacio de crecimiento artístico y personal, mientras 
              enriquecemos la vida cultural de nuestra comunidad y más allá a través de interpretaciones de 
              la más alta calidad.
            </p>
            <p className="text-lg text-gray-700">
              Nos comprometemos a preservar el patrimonio de la música coral, explorar nuevas obras contemporáneas, 
              y hacer la música accesible para todos, fomentando el amor por el canto coral en las nuevas generaciones.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-10 h-10 text-orange-600" />
              <h2 className="text-3xl text-gray-900">Nuestra Visión</h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Aspiramos a ser reconocidos como una de las principales agrupaciones corales de referencia, 
              no solo por nuestra excelencia técnica y artística, sino también por nuestro compromiso con 
              la innovación, la inclusión y la difusión cultural.
            </p>
            <p className="text-lg text-gray-700">
              Visualizamos un futuro donde la música coral sea apreciada y disfrutada por personas de todas 
              las edades y orígenes, y donde Estudio Coral Armentum sea un puente que conecte culturas, 
              generaciones y comunidades a través del poder transformador de la música.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Excelencia</h3>
              <p className="text-gray-600">
                Nos esforzamos constantemente por alcanzar los más altos estándares de calidad musical y 
                artística en cada una de nuestras interpretaciones y actividades.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Pasión</h3>
              <p className="text-gray-600">
                Nuestro amor por la música coral impulsa todo lo que hacemos. Cantamos con el corazón y 
                compartimos esa emoción con nuestras audiencias.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Comunidad</h3>
              <p className="text-gray-600">
                Somos más que un coro; somos una familia unida por el respeto mutuo, la colaboración y 
                el apoyo incondicional entre todos nuestros miembros.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Innovación</h3>
              <p className="text-gray-600">
                Abrazamos nuevas ideas, repertorios contemporáneos y formas creativas de presentar la música 
                coral, manteniendo viva y relevante esta tradición artística.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Diversidad</h3>
              <p className="text-gray-600">
                Celebramos y promovemos la diversidad en nuestro repertorio, miembros y audiencias, 
                reconociendo que la riqueza cultural nos fortalece.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Compromiso Social</h3>
              <p className="text-gray-600">
                Utilizamos la música como herramienta para contribuir positivamente a la sociedad, 
                participando en causas benéficas y programas educativos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Objetivos Estratégicos</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-600">
              <h3 className="text-xl mb-2 text-gray-900">Desarrollo Artístico Continuo</h3>
              <p className="text-gray-600">
                Ofrecer formación continua a nuestros coristas a través de talleres, masterclasses y 
                colaboraciones con directores y músicos de renombre internacional.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-orange-600">
              <h3 className="text-xl mb-2 text-gray-900">Expansión del Repertorio</h3>
              <p className="text-gray-600">
                Ampliar constantemente nuestro repertorio incluyendo obras de diferentes épocas, estilos 
                y culturas, con especial atención a compositores contemporáneos y música de nuestra región.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-600">
              <h3 className="text-xl mb-2 text-gray-900">Proyección Internacional</h3>
              <p className="text-gray-600">
                Participar en festivales y competiciones internacionales que nos permitan compartir nuestra 
                música y aprender de otras tradiciones corales alrededor del mundo.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-orange-600">
              <h3 className="text-xl mb-2 text-gray-900">Educación y Difusión</h3>
              <p className="text-gray-600">
                Desarrollar programas educativos que acerquen la música coral a escuelas, comunidades y 
                nuevas audiencias, fomentando el amor por el canto coral en las futuras generaciones.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-600">
              <h3 className="text-xl mb-2 text-gray-900">Sostenibilidad Organizativa</h3>
              <p className="text-gray-600">
                Fortalecer nuestra estructura organizativa y financiera para garantizar la continuidad y 
                crecimiento sostenible de la agrupación a largo plazo.
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
            Si te identificas con nuestros valores y quieres ser parte de esta familia coral, te invitamos a unirte a nosotros.
          </p>
          <a
            href="mailto:info@armentum.org"
            className="inline-block px-8 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Únete a Armentum
          </a>
        </div>
      </section>
    </div>
  );
}
