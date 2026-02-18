import { Link } from "react-router";
import { Home } from "lucide-react";

export function NotFound(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl text-red-600 mb-4">404</h1>
        <h2 className="text-3xl text-gray-900 mb-4">Página No Encontrada</h2>
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
