import { Facebook, Instagram, Mail, Phone, MapPin, Youtube } from "lucide-react";

function TikTokIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.5 3c.5 2.9 2.6 4.9 5.5 5.2v3.1c-1.9.1-3.8-.5-5.5-1.6V17c0 3.4-2.8 6-6.2 6-3.2 0-5.8-2.5-5.8-5.7 0-3.2 2.6-5.8 5.8-5.8.4 0 .8 0 1.2.1v3.4c-.4-.2-.8-.3-1.2-.3-1.5 0-2.7 1.2-2.7 2.7 0 1.5 1.2 2.7 2.7 2.7 1.6 0 2.6-1.1 2.6-3.1V3h3.6Z" />
    </svg>
  );
}

export function Footer(): JSX.Element {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg mb-4">Estudio Coral Armentum</h3>
            <p className="text-sm text-gray-400">
              Coro costarricense con sede en San José, dedicado a la excelencia musical y la
              promoción de la cultura coral desde 2011.
            </p>
            <p className="text-sm text-gray-400 mt-3">Céd. Jurídica 3-002-953162</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg mb-4">Contacto</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:coro.armentum@gmail.com"
                  className="hover:text-red-400 transition-colors"
                >
                  coro.armentum@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a
                  href="https://wa.me/50687998476"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors"
                >
                  WhatsApp: (506)8799-8476
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San José, Costa Rica</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Donaciones Sinpe Móvil: (506)8495-1116</span>
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
                href="https://www.youtube.com/channel/UCzILi5dzSAtnQf8ShTqzl-g"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@coroarmentum?_r=1&_t=ZS-94yAHFtmGIe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"
                title="TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
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
