import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton: React.FC = () => {
  const { logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null; // Prevents button from showing when not logged in

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: "http://localhost:5173" } })}
      className="bg-red-500 text-white p-2 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
