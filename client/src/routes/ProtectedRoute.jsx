import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {
  const {
    user,
    loading,
  } = useAuth();

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-semibold text-emerald-700">
          Loading...
        </div>
      </div>
    );
  }

  // ======================================================
  // NOT LOGGED IN
  // ======================================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ======================================================
  // ROLE BASED PROTECTION
  // ======================================================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to={user.redirectUrl || "/"}
        replace
      />
    );
  }

  // ======================================================
  // ALLOW ACCESS
  // ======================================================

  return children;
};

export default ProtectedRoute;