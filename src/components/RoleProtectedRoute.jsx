import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // SuperAdmin and Admin have access to all routes
  const hasAdminAccess = (role || []).includes("SuperAdmin") || (role || []).includes("Admin");
  if (hasAdminAccess) {
    return children;
  }

  // Check specific role permissions
  if (allowedRoles.length > 0 && !allowedRoles.some(allowedRole => (role || []).includes(allowedRole))) {
    console.log(user);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleProtectedRoute;