import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";
import Loading from "@/components/ui/Loading";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Show a spinner or nothing while loading
  if (user === undefined) return <Loading />;

  if (!user?.isAdmin) return <Navigate to="/" replace />;

  // Admin can access the route
  return children;
};

export default AdminRoute;
