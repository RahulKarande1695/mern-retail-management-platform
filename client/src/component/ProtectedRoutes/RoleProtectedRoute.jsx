import { Navigate } from "react-router-dom";


const RoleProtectedRoute = ({
  children,
  role,
}) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );
  console.log(user, "user");
  // Login check
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Role check
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;