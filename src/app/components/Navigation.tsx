import { Link, useLocation, useNavigate } from "react-router";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Calendar,
  Download,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../../assets/isotipo.png";
import { useAuthStore } from "../../stores/authStore";

export function Navigation(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isPortalMenuOpen, setIsPortalMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hydrate, isInitializing } = useAuthStore();
  const isAuth = useAuthStore((state) => state.checkAuth());

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    setIsPortalMenuOpen(false);
  }, [location.pathname]);

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

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    return user.userType === "admin" ? "/admin" : "/coristas";
  };

  const coristaMenuLinks = [
    { path: "/coristas", label: "Portal Corista", icon: User },
    { path: "/calendario", label: "Calendario de Ensayos", icon: Calendar },
    { path: "/mis-asistencias", label: "Mis Asistencias", icon: CheckCircle },
    { path: "/finanzas", label: "Mis Finanzas", icon: CreditCard },
    { path: "/descargas", label: "Centro de Descargas", icon: Download },
  ];

  if (isInitializing) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Logo Armentum" className="h-12 w-12" />
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-gray-900">Estudio Coral</span>
                <span className="text-lg text-red-600">Armentum</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo Armentum" className="h-12 w-12" />
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-gray-900">Estudio Coral</span>
              <span className="text-lg text-red-600">Armentum</span>
            </div>
          </Link>

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
              {isAuth && user ? (
                <>
                  {user.userType === "admin" ? (
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Admin</span>
                    </Link>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => setIsPortalMenuOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Portal</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isPortalMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 transition-all duration-150 ${
                          isPortalMenuOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                        }`}
                      >
                        {coristaMenuLinks.map(({ path, label, icon: Icon }) => (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setIsPortalMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Salir</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Acceso</span>
                </Link>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

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

              {isAuth && user ? (
                <>
                  {user.userType === "admin" ? (
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 mt-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border-t border-gray-200 pt-4"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Panel Admin</span>
                    </Link>
                  ) : (
                    <div className="pt-4 border-t border-gray-200 flex flex-col gap-2">
                      {coristaMenuLinks.map(({ path, label, icon: Icon }) => (
                        <Link
                          key={path}
                          to={path}
                          onClick={() => {
                            setIsOpen(false);
                            setIsPortalMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 mt-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border-t border-gray-200 pt-4"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Acceso Coristas/Admin</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
