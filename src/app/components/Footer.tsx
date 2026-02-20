import { Facebook, Instagram, Globe, Mail, Phone, MapPin } from "lucide-react";

export function Footer(): JSX.Element {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg mb-4">Estudio Coral Armentum</h3>
            <p className="text-sm text-gray-400">
              Coro costarricense aficionado con sede en San José, dedicado a la excelencia musical y
              la promoción de la cultura coral desde 2011.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg mb-4">Contacto</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="https://sites.google.com/view/estudiocoralarmentum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors"
                >
                  estudiocoralarmentum
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>SINPE Móvil: 8795-1116</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San José, Costa Rica</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white text-lg mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/estudiocoralarmentum"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/armentum.estudio.coral"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://sites.google.com/view/estudiocoralarmentum"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"
                title="Sitio Web"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3">Donaciones: SINPE Móvil 8795-1116</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Estudio Coral Armentum. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
