import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import type { UserRole } from "../../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps): JSX.Element {
  const location = useLocation();
  const { user, isInitializing } = useAuthStore();
  const isAuth = useAuthStore((state) => state.checkAuth());

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuth || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.userType !== requiredRole && user.userType !== "admin") {
    if (user.userType === "corista") {
      return <Navigate to="/coristas" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
