import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to test_home
    if (!isLoading && isAuthenticated) {
      navigate("/test_home");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Bienvenido a Futurapp</h1>
        <p className="mb-6 text-center text-gray-600">
          Inicia sesión para acceder a nuestro recomendador de carreras profesionales.
        </p>
        {!isAuthenticated && (
          <button
            onClick={() => loginWithRedirect()}
            className="w-full bg-primary text-white p-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;