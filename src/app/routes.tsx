import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { Historia } from "./pages/Historia";
import { Mision } from "./pages/Mision";
import { Noticias } from "./pages/Noticias";
import { Eventos } from "./pages/Eventos";
import { Login } from "./pages/Login";
import { Coristas } from "./pages/Coristas";
import { Admin } from "./pages/Admin";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Calendario } from "./pages/Calendario";
import { MisAsistencias } from "./pages/MisAsistencias";
import { Finanzas } from "./pages/Finanzas";
import { Descargas } from "./pages/Descargas";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "historia", Component: Historia },
      { path: "mision", Component: Mision },
      { path: "noticias", Component: Noticias },
      { path: "eventos", Component: Eventos },
      { path: "login", Component: Login },
      {
        path: "coristas",
        element: (
          <ProtectedRoute requiredRole="corista">
            <Coristas />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        ),
      },
      // Corista routes
      {
        path: "calendario",
        element: (
          <ProtectedRoute requiredRole="corista">
            <Calendario />
          </ProtectedRoute>
        ),
      },
      {
        path: "mis-asistencias",
        element: (
          <ProtectedRoute requiredRole="corista">
            <MisAsistencias />
          </ProtectedRoute>
        ),
      },
      {
        path: "finanzas",
        element: (
          <ProtectedRoute requiredRole="corista">
            <Finanzas />
          </ProtectedRoute>
        ),
      },
      {
        path: "descargas",
        element: (
          <ProtectedRoute requiredRole="corista">
            <Descargas />
          </ProtectedRoute>
        ),
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
