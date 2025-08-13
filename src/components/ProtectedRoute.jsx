import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // wait for auth
  if (!user) return <Navigate to="/" />; // redirect if not logged in

  return children; // render the protected component
}
