import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    if (!storedRole || (requiredRole && storedRole !== requiredRole)) {
      navigate("/login");
    }
  }, [requiredRole, navigate]);
  return children ? children : <Outlet />;
};

export default PrivateRoute;
