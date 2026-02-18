import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { LogIn, User, Shield, AlertCircle } from "lucide-react";
import logo from "../../assets/isotipo.png";
import { useAuthStore } from "../../stores/authStore";
import type { User as UserType } from "../../types";

export function Login(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, isLoading, clearError, user, isInitializing } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"corista" | "admin">("corista");

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || null;

  useEffect(() => {
    if (!isInitializing && user) {
      const redirectPath = from || (user.userType === "admin" ? "/admin" : "/coristas");
      navigate(redirectPath, { replace: true });
    }
  }, [user, isInitializing, navigate, from]);

  useEffect(() => {
    clearError();
  }, [email, password, userType, clearError]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const success = await login(email, password, userType);
    if (success) {
      const authUser = useAuthStore.getState().user as UserType;
      const redirectPath = from || (authUser.userType === "admin" ? "/admin" : "/coristas");
      navigate(redirectPath, { replace: true });
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo Armentum" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-3xl text-gray-900 mb-2">Bienvenido</h1>
          <p className="text-gray-600">Acceso a la zona privada de Estudio Coral Armentum</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType("corista")}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all disabled:opacity-50 ${
                userType === "corista"
                  ? "border-red-600 bg-red-50 text-red-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
              aria-pressed={userType === "corista"}
            >
              <User className="w-5 h-5 mx-auto mb-1" />
              <span className="block text-sm">Corista</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType("admin")}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all disabled:opacity-50 ${
                userType === "admin"
                  ? "border-red-600 bg-red-50 text-red-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
              aria-pressed={userType === "admin"}
            >
              <Shield className="w-5 h-5 mx-auto mb-1" />
              <span className="block text-sm">Admin</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={isLoading}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-600 disabled:opacity-50"
                  aria-label="Recordarme"
                />
                <span className="text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-red-600 hover:text-red-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              <span>{isLoading ? "Iniciando..." : "Iniciar Sesión"}</span>
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            ¿Necesitas ayuda? Contacta con{" "}
            <a href="mailto:info@armentum.org" className="text-red-600 hover:text-red-700">
              info@armentum.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
