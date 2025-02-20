import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton: React.FC = () => {
  const { logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null;

  // Use environment variable or fallback to window.location.origin
  const returnTo = import.meta.env.VITE_AUTH0_RETURN_URL || window.location.origin;

  return (
    <button
      onClick={() => logout({ 
        logoutParams: { returnTo }
      })}
      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
