import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { path } from "@/constants/routes.const";

export default function ProtectedRoute({ children, to = path.logIn }) {
  const { user } = useAuth();
  if (user === undefined) return null; // or a spinner component
  return user ? children : <Navigate to={to} replace />;
}
