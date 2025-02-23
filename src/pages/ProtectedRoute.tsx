import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: location.pathname, // Store the intended page
        },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, location.pathname]);

  useEffect(() => {
    if (isAuthenticated && shouldRedirect) {
      navigate(location.pathname, { replace: true });
    }
  }, [isAuthenticated, shouldRedirect, navigate, location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      setShouldRedirect(true);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
