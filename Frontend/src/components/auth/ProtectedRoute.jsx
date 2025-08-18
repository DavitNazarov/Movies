import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, to = "/login" }) {
  const { user } = useAuth();
  if (user === undefined) return null; // or a spinner component
  return user ? children : <Navigate to={to} replace />;
}
