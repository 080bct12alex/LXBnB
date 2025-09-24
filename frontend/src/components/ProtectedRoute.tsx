import { Navigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("guest" | "hotel-owner")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, currentUser } = useAppContext();

  if (!isLoggedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
