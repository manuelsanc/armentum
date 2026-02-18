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
      { path: "*", Component: NotFound },
    ],
  },
]);
