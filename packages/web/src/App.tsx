import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import ETF from "./pages/etf";
import Index from "./pages/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/index",
    element: <Index />,
  },
  {
    path: "/:code",
    element: <ETF />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
