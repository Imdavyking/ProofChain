import { useRoutes } from "react-router-dom";
import Home from "../views/home/main";
import GetStarted from "../views/get-started/main";
import NotFound from "../views/not-found/main";
import UploadNow from "../views/upload-now/main";
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
      path: "/upload-now",
      element: <UploadNow />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];
  return useRoutes(routes);
}

export default Router;
