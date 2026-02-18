import { RouterProvider } from "react-router";
import { router } from "./routes";

export function App(): JSX.Element {
  return <RouterProvider router={router} />;
}
