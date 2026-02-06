import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  // Role check (array-safe)
  const hasAccess = user.roles?.some(role =>
    allowedRoles.includes(role)
  );

  if (!hasAccess) {
    // Pretend page doesn't exist
    return <Navigate to="/not-found" replace />;
  }
  return children;
};

export default ProtectedRoute;
