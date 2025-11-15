import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Navigate } from "react-router-dom";
import { adminApi } from "@/services/adminApi";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || isLoading) {
        setCheckingAdmin(false);
        return;
      }

      try {
        // Try to access an admin endpoint to verify admin status
        await adminApi.getUsers(1, 1, '', getAccessTokenSilently);
        setIsAdmin(true);
      } catch (error: any) {
        // If we get a 403, user is not admin
        if (error.message?.includes('403') || error.message?.includes('Admin')) {
          setIsAdmin(false);
        } else {
          // Other errors might be network issues, assume not admin for safety
          setIsAdmin(false);
        }
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  if (isLoading || checkingAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You do not have permission to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return isAdmin ? children : null;
};

export default AdminRoute;

