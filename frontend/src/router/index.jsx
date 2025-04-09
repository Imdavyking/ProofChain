import { useRoutes } from "react-router-dom";
import Home from "../views/home/home";
import GetStarted from "../views/get-stated/get-stated";
import NotFound from "../views/not-found/Main";
function Router() {
  const routes = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/get-started",
      element: <GetStarted />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];
  return useRoutes(routes);
}

export default Router;
