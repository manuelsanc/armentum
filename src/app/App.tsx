import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useAuthStore } from "../stores/authStore";

export function App(): JSX.Element {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <RouterProvider router={router} />;
}
