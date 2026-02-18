import { Calendar, Facebook, Instagram, Youtube, ExternalLink } from "lucide-react";

export function Noticias(): JSX.Element {
  const news = [
    {
      id: 1,
      title: "Exitoso Concierto de Primavera 2026",
      date: "2026-02-10",
      excerpt: "Más de 500 personas disfrutaron de nuestro concierto de primavera en el Auditorio Nacional, con un repertorio que incluyó obras de Mozart, Whitacre y compositores españoles contemporáneos.",
      image: "https://images.unsplash.com/photo-1610254449353-5698372fa83b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9pciUyMGNvbmNlcnQlMjBoYWxsfGVufDF8fHx8MTc3MTI4ODM2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      social: "facebook"
    },
    {
      id: 2,
      title: "Preparando Nuestra Gira de Verano",
      date: "2026-02-05",
      excerpt: "Estamos emocionados de anunciar nuestra próxima gira por Francia y Alemania durante julio. Visitaremos 6 ciudades y nos presentaremos en prestigiosas catedrales y salas de concierto.",
      image: "https://images.unsplash.com/photo-1662938926048-41f3e3be5484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNhdGhlZHJhbCUyMGludGVyaW9yfGVufDF8fHx8MTc3MTI4ODM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      social: "instagram"
    },
    {
      id: 3,
      title: "Taller con Eric Whitacre - Una Experiencia Inolvidable",
      date: "2026-01-28",
      excerpt: "Tuvimos el honor de trabajar con el reconocido compositor Eric Whitacre en un taller intensivo de dos días. Una experiencia transformadora para todos nuestros coristas.",
      image: "https://images.unsplash.com/photo-1657128632843-22dc22049b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9pciUyMHdvcmtzaG9wJTIwcmVoZWFyc2FsfGVufDF8fHx8MTc3MTI4ODM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      social: "youtube"
    },
    {
      id: 4,
      title: "Nuevo Álbum: 'Voces del Alma'",
      date: "2026-01-15",
      excerpt: "Ya está disponible en todas las plataformas digitales nuestro nuevo álbum discográfico que recopila obras de compositores españoles del siglo XXI. Un proyecto que nos llena de orgullo.",
      image: "https://images.unsplash.com/photo-1593697725250-6a184f4e9ed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHJlY29yZGluZyUyMHN0dWRpb3xlbnwxfHx8fDE3NzEyODgzNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      social: "facebook"
    },
    {
      id: 5,
      title: "Colaboración con la Orquesta Sinfónica",
      date: "2026-01-08",
      excerpt: "Anunciamos nuestra colaboración con la Orquesta Sinfónica de Madrid para interpretar el Réquiem de Mozart en marzo. Las entradas ya están a la venta.",
      image: "https://images.unsplash.com/photo-1551696785-927d4ac2d35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmElMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzEyODgzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      social: "instagram"
    },
    {
      id: 6,
      title: "Programa de Becas para Jóvenes Cantantes",
      date: "2025-12-20",
      excerpt: "Lanzamos nuestro nuevo programa de becas para apoyar a jóvenes talentosos de 18 a 25 años que deseen formar parte de nuestra agrupación. Las solicitudes están abiertas hasta marzo.",
      image: "https://images.unsplash.com/photo-1764176269321-6d14f4af09c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHNpbmdlcnMlMjBjaG9pcnxlbnwxfHx8fDE3NzEyODgzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      social: "facebook"
    }
  ];

  const socialFeeds = [
    { platform: "Facebook", icon: Facebook, followers: "5.2K", color: "bg-blue-600" },
    { platform: "Instagram", icon: Instagram, followers: "8.1K", color: "bg-pink-600" },
    { platform: "YouTube", icon: Youtube, followers: "3.4K", color: "bg-red-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-6">Noticias y Actualidad</h1>
          <p className="text-xl text-red-100 max-w-3xl">
            Mantente al día con todas las novedades, eventos y logros de Estudio Coral Armentum.
          </p>
        </div>
      </section>

      {/* Social Media Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-center mb-8 text-gray-900">Síguenos en Redes Sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialFeeds.map((social) => (
              <a
                key={social.platform}
                href={`https://${social.platform.toLowerCase()}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-red-600 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${social.color} rounded-full flex items-center justify-center`}>
                    <social.icon className="w-6 h-6 text-white" />
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                </div>
                <h3 className="text-xl mb-2 text-gray-900">{social.platform}</h3>
                <p className="text-2xl text-red-600">{social.followers}</p>
                <p className="text-sm text-gray-600">Seguidores</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {item.social === "facebook" && (
                      <div className="bg-blue-600 rounded-full p-2">
                        <Facebook className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {item.social === "instagram" && (
                      <div className="bg-pink-600 rounded-full p-2">
                        <Instagram className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {item.social === "youtube" && (
                      <div className="bg-red-600 rounded-full p-2">
                        <Youtube className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={item.date}>
                      {new Date(item.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <h3 className="text-xl mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <button className="text-red-600 hover:text-red-700 transition-colors">
                    Leer más →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4 text-gray-900">Recibe Nuestras Noticias</h2>
          <p className="text-lg text-gray-600 mb-8">
            Suscríbete a nuestro boletín y recibe las últimas noticias, eventos y contenido exclusivo directamente en tu correo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}