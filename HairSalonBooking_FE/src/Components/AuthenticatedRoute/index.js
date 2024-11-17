import { Navigate } from "react-router-dom";

const AuthenticatedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthenticatedRoute;
