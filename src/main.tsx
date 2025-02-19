// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import FormView from './App';
import Login from './Login'; // optional login page if you want a custom login view
import ProtectedRoute from './ProtectedRoute';
import { Auth0Provider } from '@auth0/auth0-react';
import About from './pages/About';

const domain = 'dev-cw4j08ldhb6pgkzs.us.auth0.com';       // e.g. dev-abc123.us.auth0.com
const clientId = 'FOHKg168YFW90b7jRMF2k4K49Jb1vjXF';    // Your Auth0 Client ID

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://dev-cw4j08ldhb6pgkzs.us.auth0.com/api/v2/'
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <FormView />
              </ProtectedRoute>
            }
          />
            <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
