import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    const dashboard = user.role === "professor" ? "/professor/dashboard" : "/student/dashboard";
    return <Navigate to={dashboard} state={{ from: location }} />;
  }

  return children;
}
