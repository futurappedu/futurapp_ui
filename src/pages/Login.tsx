import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const SEARCH_PAIS_KEY = 'search_pais';
const SEARCH_PROGRAMA_KEY = 'search_programa';

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Save campaign search params (pais/programa) to sessionStorage before
  // Auth0's redirect clears the URL — the query string won't survive the
  // login round-trip otherwise (Auth0's redirect_uri is bare origin).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pais = params.get('pais');
    const programa = params.get('programa');
    if (pais) sessionStorage.setItem(SEARCH_PAIS_KEY, pais);
    if (programa) sessionStorage.setItem(SEARCH_PROGRAMA_KEY, programa);
  }, []);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const hasSearchParams =
      sessionStorage.getItem(SEARCH_PAIS_KEY) !== null ||
      sessionStorage.getItem(SEARCH_PROGRAMA_KEY) !== null;

    // If user is already authenticated, redirect to test_home,
    // unless a campaign search link is pending — then go to the search page.
    navigate(hasSearchParams ? '/scholarship-search' : '/test_home');
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Bienvenido a UniMatch</h1>
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