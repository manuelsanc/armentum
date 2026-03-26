import { ServiceQuoteModal } from "../components/ServiceQuoteModal";
import enEscenaVideo from "../../assets/servicios/en_escena_1.mp4";
import enEscena01 from "../../assets/servicios/en_escena_01.jpeg";
import enEscena02 from "../../assets/servicios/en_escena_02.jpeg";
import enEscena03 from "../../assets/servicios/en_escena_03.jpeg";
import enEscena04 from "../../assets/servicios/en_escena_04.jpeg";
import enEscena05 from "../../assets/servicios/en_escena_05.jpeg";
import enEscena06 from "../../assets/servicios/en_escena_06.jpeg";
import enEscena07 from "../../assets/servicios/en_escena_07.jpeg";
import enEscena08 from "../../assets/servicios/en_escena_08.jpeg";
import enEscena09 from "../../assets/servicios/en_escena_09.jpeg";
import enEscena10 from "../../assets/servicios/en_escena_10.jpeg";
import enEscena11 from "../../assets/servicios/en_escena_11.jpeg";
import enEscena12 from "../../assets/servicios/en_escena_12.jpeg";
import enEscena13 from "../../assets/servicios/en_escena_13.jpeg";
import enEscena14 from "../../assets/servicios/en_escena_14.jpeg";
import enEscena15 from "../../assets/servicios/en_escena_15.jpeg";
import enEscena16 from "../../assets/servicios/en_escena_16.jpeg";
import enEscena17 from "../../assets/servicios/en_escena_17.jpeg";
import enEscena18 from "../../assets/servicios/en_escena_18.jpeg";
import enEscena19 from "../../assets/servicios/en_escena_19.jpeg";
import enEscena20 from "../../assets/servicios/en_escena_20.jpeg";
import enEscena21 from "../../assets/servicios/en_escena_21.jpeg";
import enEscena22 from "../../assets/servicios/en_escena_22.jpeg";
import enEscena23 from "../../assets/servicios/en_escena_23.jpeg";

const EVENT_TYPES = [
  "Aniversarios corporativos",
  "Cumpleaños y celebraciones privadas",
  "Actividades culturales y artísticas",
  "Eventos institucionales",
  "Conciertos temáticos",
  "Ceremonias especiales",
];

const REPERTOIRE = [
  "Música sacra",
  "Música latinoamericana",
  "Arreglos corales de música pop",
  "Villancicos y repertorio navideño",
];

const GALLERY_IMAGES = [
  enEscena01,
  enEscena02,
  enEscena03,
  enEscena04,
  enEscena05,
  enEscena06,
  enEscena07,
  enEscena08,
  enEscena09,
  enEscena10,
  enEscena11,
  enEscena12,
  enEscena13,
  enEscena14,
  enEscena15,
  enEscena16,
  enEscena17,
  enEscena18,
  enEscena19,
  enEscena20,
  enEscena21,
  enEscena22,
  enEscena23,
];

export function Servicios(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-6">Servicios</h1>
          <p className="text-xl text-red-100 max-w-3xl">
            “Llevamos la música donde las palabras no alcanzan”
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
            <div className="space-y-6">
              <p className="text-gray-700 text-lg">
                En Armentum Estudio Coral, transformamos cada ocasión en una experiencia inolvidable
                a través de la fuerza y belleza del canto coral. Ya sea un evento íntimo o una gran
                celebración, nuestro repertorio y calidad interpretativa se adaptan para crear
                momentos únicos que conectan con las emociones del público.
              </p>
              <div>
                <h2 className="text-2xl text-gray-900 mb-4">
                  Ofrecemos presentaciones corales para todo tipo de eventos
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EVENT_TYPES.map((item) => (
                    <li
                      key={item}
                      className="bg-white rounded-lg border border-gray-200 p-4 text-gray-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl text-gray-900 mb-4">
                  Contamos con un repertorio amplio y versátil
                </h3>
                <ul className="space-y-3">
                  {REPERTOIRE.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-700">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-lg text-gray-800 font-medium">
                Cada presentación se adapta al estilo, ambiente y propósito de tu evento.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl text-gray-900 mb-3">Destacado</h3>
              <p className="text-gray-600 mb-4">
                Mira un extracto en video de nuestras presentaciones.
              </p>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-black">
                <video
                  className="w-full h-56 md:h-64 object-cover"
                  controls
                  preload="metadata"
                  poster={enEscena12}
                >
                  <source src={enEscenaVideo} type="video/mp4" />
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-center text-gray-900 mb-8">Momentos en escena</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((image, index) => (
              <figure
                key={image}
                className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              >
                <img
                  src={image}
                  alt={`Presentación en escena ${index + 1}`}
                  className="h-32 md:h-40 w-full object-cover"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Quote / CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl text-gray-900 mb-4">Solicitar Cotización</h2>
          <p className="text-lg text-gray-700 mb-8">
            Haz de tu evento algo inolvidable. Completa el siguiente formulario y te contactaremos
            para diseñar una propuesta musical a tu medida.
          </p>
          <ServiceQuoteModal />
        </div>
      </section>
    </div>
  );
}
