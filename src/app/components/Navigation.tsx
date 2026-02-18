import { Link, useLocation } from "react-router";
import { Menu, X, LogIn, User, Shield } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/isotipo.png";

export function Navigation(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Inicio" },
    { path: "/historia", label: "Historia" },
    { path: "/mision", label: "Misión" },
    { path: "/noticias", label: "Noticias" },
    { path: "/eventos", label: "Eventos" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo Armentum" className="h-12 w-12" />
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-gray-900">Estudio Coral</span>
              <span className="text-lg text-red-600">Armentum</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive(link.path)
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="flex items-center gap-2 ml-4 border-l border-gray-300 pl-4">
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm">Acceso</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive(link.path)
                      ? "text-red-600 bg-red-50"
                      : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 mt-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border-t border-gray-200 pt-4"
              >
                <LogIn className="w-4 h-4" />
                <span>Acceso Coristas/Admin</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
