import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: "conciertos" | "ensayos" | "giras";
  caption: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",
    alt: "Concierto coral",
    category: "conciertos",
    caption: "Concierto de Temporada",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    alt: "Ensayo coral",
    category: "ensayos",
    caption: "Ensayo semanal",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    alt: "Gira internacional",
    category: "giras",
    caption: "Gira España 2024",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    alt: "Concierto navideño",
    category: "conciertos",
    caption: "Concierto Navideño",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1468164016595-6108e4c60753?w=800&q=80",
    alt: "Ensayo con director",
    category: "ensayos",
    caption: "Ensayo con el Director",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&q=80",
    alt: "Barcelona",
    category: "giras",
    caption: "Barcelona — Sagrada Familia 2024",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80",
    alt: "Festival coral",
    category: "conciertos",
    caption: "Festival Coral Nacional",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
    alt: "Ensayo gruporal",
    category: "ensayos",
    caption: "Preparando el repertorio",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80",
    alt: "Madrid",
    category: "giras",
    caption: "Madrid — Pueblo Antiguo 2024",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?w=800&q=80",
    alt: "Teatro Nacional",
    category: "conciertos",
    caption: "Teatro Nacional, San José",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80",
    alt: "Ensayo vocal",
    category: "ensayos",
    caption: "Técnica vocal",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    alt: "Gira Costa Rica",
    category: "giras",
    caption: "Gira Nacional Tilarán",
  },
];

const CATEGORIES = [
  { key: "todos", label: "Todos" },
  { key: "conciertos", label: "Conciertos" },
  { key: "ensayos", label: "Ensayos" },
  { key: "giras", label: "Giras" },
] as const;

export function Galeria(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const filteredImages =
    activeCategory === "todos"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

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
      <section className="py-8 bg-white shadow-sm sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow"
                onClick={() => setLightboxImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay con caption */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                  <div className="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
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

          {filteredImages.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              No hay imágenes en esta categoría aún.
            </div>
          )}
        </div>
      </section>

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
              src={lightboxImage.src.replace("w=800", "w=1200").replace("w=600", "w=1200")}
              alt={lightboxImage.alt}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white text-center text-sm">{lightboxImage.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
