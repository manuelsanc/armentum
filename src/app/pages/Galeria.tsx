import { useState, useMemo } from "react";
import { X, ZoomIn } from "lucide-react";
import { useGallery } from "../../hooks/useGallery";
import type { GalleryImage } from "../../types";

export function Galeria(): JSX.Element {
  const { images, isLoading, filterByTags } = useGallery(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  // Extract unique tags from all images
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    images.forEach((image) => {
      if (image.tags && Array.isArray(image.tags)) {
        image.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [images]);

  const handleTagClick = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newSelectedTags);
    filterByTags(newSelectedTags);
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    filterByTags([]);
  };

  const formatDate = (dateString: string): string => {
    // Parse date as local date to avoid timezone conversion issues
    // Backend sends dates in YYYY-MM-DD format
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-6">Galería</h1>
          <p className="text-xl text-red-100 max-w-3xl">
            Momentos que capturan la pasión, la música y la comunidad del Estudio Coral Armentum.
          </p>
        </div>
      </section>

      {/* Filtros */}
      {availableTags.length > 0 && (
        <section className="py-8 bg-white shadow-sm sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleClearFilters}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTags.length === 0
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                Todos
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16 text-gray-500">Cargando galería...</div>
          </div>
        </section>
      )}

      {/* Masonry Grid */}
      {!isLoading && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow"
                  onClick={() => setLightboxImage(image)}
                >
                  <img
                    src={image.thumbnail_url}
                    alt={image.titulo}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay con caption */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                    <div className="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-semibold">
                        {image.titulo}
                      </p>
                      <p className="text-white/90 text-xs mt-1">
                        {formatDate(image.fecha)}
                      </p>
                      {image.descripcion && (
                        <p className="text-white/80 text-xs mt-2 line-clamp-2">
                          {image.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Icono zoom */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/80 rounded-full p-1.5">
                      <ZoomIn className="w-4 h-4 text-gray-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                {selectedTags.length > 0
                  ? "No hay imágenes con las etiquetas seleccionadas."
                  : "No hay imágenes en la galería aún."}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="max-w-4xl max-h-[90vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.image_url}
              alt={lightboxImage.titulo}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            <div className="text-white text-center max-w-2xl">
              <p className="text-lg font-semibold">{lightboxImage.titulo}</p>
              <p className="text-sm text-white/80 mt-1">{formatDate(lightboxImage.fecha)}</p>
              {lightboxImage.descripcion && (
                <p className="text-sm text-white/70 mt-3">{lightboxImage.descripcion}</p>
              )}
              {lightboxImage.tags && lightboxImage.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {lightboxImage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/20 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
