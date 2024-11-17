import { Routes } from "../../Routes";
import { useRoutes } from "react-router-dom";

function AllRoutes() {
  const element = useRoutes(Routes);
  return <>{element}</>;
}

export default AllRoutes;
