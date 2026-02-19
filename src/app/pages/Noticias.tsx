import { useState } from "react";
import { Calendar, Facebook, Instagram, Youtube, ExternalLink } from "lucide-react";
import { useNewsList } from "../../hooks/useNews";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Noticias(): JSX.Element {
  const [paginationLimit] = useState(12);
  const [paginationOffset, setPaginationOffset] = useState(0);

  const { news, loading } = useNewsList(paginationLimit, paginationOffset);

  const socialFeeds = [
    { platform: "Facebook", icon: Facebook, followers: "5.2K", color: "bg-blue-600" },
    { platform: "Instagram", icon: Instagram, followers: "8.1K", color: "bg-pink-600" },
    { platform: "YouTube", icon: Youtube, followers: "3.4K", color: "bg-red-600" },
  ];

  const handleLoadMore = () => {
    setPaginationOffset((prev) => prev + paginationLimit);
  };

  // Extraer red social de cada noticia (si está disponible en datos)
  const getSocialIcon = (index: number) => {
    const socialPlatforms = ["facebook", "instagram", "youtube"];
    return socialPlatforms[index % 3];
  };

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
                  <div
                    className={`w-12 h-12 ${social.color} rounded-full flex items-center justify-center`}
                  >
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : news.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item, index) => {
                  const itemTitle = item.titulo || item.title || "";
                  const itemContent = item.contenido || item.content || "";
                  const itemDate = item.created_at || item.createdAt || "";
                  const socialPlatform = getSocialIcon(index);
                  // Usar una imagen por defecto o la que venga del backend
                  const itemImage =
                    "https://images.unsplash.com/photo-1610254449353-5698372fa83b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

                  return (
                    <article
                      key={item.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="h-48 bg-gray-200 relative overflow-hidden">
                        <ImageWithFallback
                          src={itemImage}
                          alt={itemTitle}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          {socialPlatform === "facebook" && (
                            <div className="bg-blue-600 rounded-full p-2">
                              <Facebook className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {socialPlatform === "instagram" && (
                            <div className="bg-pink-600 rounded-full p-2">
                              <Instagram className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {socialPlatform === "youtube" && (
                            <div className="bg-red-600 rounded-full p-2">
                              <Youtube className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        {itemDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={itemDate}>
                              {new Date(itemDate).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                          </div>
                        )}
                        <h3 className="text-xl mb-3 text-gray-900 line-clamp-2">{itemTitle}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{itemContent}</p>
                        <button className="text-red-600 hover:text-red-700 transition-colors font-medium">
                          Leer más →
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Load More Button */}
              {news.length === paginationLimit && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Cargar más noticias
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No hay noticias disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4 text-gray-900">Recibe Nuestras Noticias</h2>
          <p className="text-lg text-gray-600 mb-8">
            Suscríbete a nuestro boletín y recibe las últimas noticias, eventos y contenido
            exclusivo directamente en tu correo.
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
