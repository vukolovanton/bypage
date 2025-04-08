import ReactDOM from "react-dom/client";
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router";
import Library from "./layout/Library";
import "./App.css";

const router = createMemoryRouter([
  {
    path: "/",
    element: <Library />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
