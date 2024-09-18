import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import Etf from "./pages/etf";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:code",
    element: <Etf />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
