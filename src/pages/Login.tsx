// src/Login.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  // If the user is already authenticated, you might choose to redirect them away from the login page.
  if (isAuthenticated) {
    return <div>You are already logged in.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Please Log In</h1>
      <button
        onClick={() => loginWithRedirect()}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
