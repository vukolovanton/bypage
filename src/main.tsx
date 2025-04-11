import ReactDOM from "react-dom/client";
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router";
import Library from "./layout/Library";
import "./App.css";
import Reader from "./layout/Reader";

const router = createMemoryRouter([
  {
    path: "/",
    element: <Library />,
  },
  {
    path: "/reader",
    element: <Reader />,
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
