import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Navigate } from "react-router-dom";
import { adminApi } from "@/services/adminApi";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0();
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
        // Try to get token silently, but handle errors
        // Use the default audience from Auth0Provider
        try {
          await getAccessTokenSilently();
        } catch (tokenError: any) {
          console.error('Token error:', tokenError);
          
          // If silent auth fails, it might be a session issue
          // Try redirecting to login
          if (tokenError.error === 'login_required' || 
              tokenError.error === 'consent_required' ||
              tokenError.error === 'interaction_required') {
            loginWithRedirect({
              appState: {
                returnTo: window.location.pathname
              }
            });
            return;
          }
          
          // For other errors, deny access
          console.error('Failed to get token:', tokenError);
          setIsAdmin(false);
          setCheckingAdmin(false);
          return;
        }

        // Now check admin status
        await adminApi.getUsers(1, 1, '', getAccessTokenSilently);
        setIsAdmin(true);
      } catch (error: any) {
        console.error('Admin check error:', error);
        
        // Check if it's a 403 (forbidden) vs other errors
        if (error.message?.includes('403') || 
            error.message?.includes('Admin') ||
            error.message?.includes('insufficient_permissions')) {
          setIsAdmin(false);
        } else {
          console.error('Network error checking admin status:', error);
          setIsAdmin(false);
        }
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect]);

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

  return isAdmin === true ? children : null;
};

export default AdminRoute;