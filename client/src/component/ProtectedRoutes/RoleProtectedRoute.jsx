import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RoleProtectedRoute = ({ children, role }) => {
  const roleName = sessionStorage.getItem("currentRole");

  let token = "";

  switch (roleName) {
    case "shop":
      token = localStorage.getItem("shopToken");
      break;

    case "customer":
      token = localStorage.getItem("customerToken");
      break;

    case "deliveryPartner":
      token = localStorage.getItem("deliveryPartnerToken");
      break;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Role Check
    if (decoded.role !== role) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
};

export default RoleProtectedRoute;
