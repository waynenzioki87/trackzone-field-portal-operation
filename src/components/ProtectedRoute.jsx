import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("trackzone_token");
  const user = JSON.parse(localStorage.getItem("trackzone_user") || "{}");
  if (!token) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/not-authorized" replace />;
  return children;
}

export default ProtectedRoute;
