import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL from the location state or default to home
  const returnTo = location.state?.returnTo || "/career_recommender";

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (!isLoading && isAuthenticated) {
      navigate(returnTo);
    }
  }, [isAuthenticated, isLoading, navigate, returnTo]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Bienvenido a Futurapp</h1>
        <p className="mb-6 text-center text-gray-600">
          Inicia sesión para acceder a nuestro recomendador de carreras profesionales.
        </p>
        <button
          onClick={() => loginWithRedirect({
            appState: { returnTo }
          })}
          className="w-full bg-primary text-white p-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default Login;