import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already authenticated, check profile and redirect accordingly
    const checkProfileAndRedirect = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const res = await fetch("https://futurappapi-staging.up.railway.app/check-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });
        const data = await res.json();
        if (data.completed) {
          navigate("/test_home");
        } else {
          navigate("/profile");
        }
      } catch (err) {
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && isAuthenticated) {
      checkProfileAndRedirect();
    }
  }, [isAuthenticated, isLoading, navigate, user]);

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
            disabled={loading}
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;