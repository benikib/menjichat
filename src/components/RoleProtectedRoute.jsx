import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleProtectedRoute;