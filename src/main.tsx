// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import FormView from "./App";
import Home from "./pages/Home";
import TestHome from "./pages/TestHome";
import {
  MechanicalTest,
  NumericTest,
  SpatialReasoningTest,
  VerbalTestApp,
  AbstractTestApp,
} from "./pages/tests";
import Profile from "./pages/Profile";
import Login from "./pages/Login"; // optional login page if you want a custom login view
import ProtectedRoute from "./pages/ProtectedRoute";
import { Auth0Provider, AppState } from "@auth0/auth0-react";
import About from "./pages/About";

const domain = "dev-cw4j08ldhb6pgkzs.us.auth0.com"; // e.g. dev-abc123.us.auth0.com
const clientId = "FOHKg168YFW90b7jRMF2k4K49Jb1vjXF"; // Your Auth0 Client ID

const Auth0ProviderWithNavigate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || "/career_recommender", { replace: true });
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-cw4j08ldhb6pgkzs.us.auth0.com/api/v2/",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Auth0ProviderWithNavigate>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career_recommender"
            element={
              <ProtectedRoute>
                <FormView />  
              </ProtectedRoute>
            }
          />
          <Route
            path="/verbal_test"
            element={  
                <VerbalTestApp />
            }
          />
          <Route
            path="/numerical_test"
            element={
                <NumericTest />
            }
          />
          <Route
            path="/mechanical_test"
            element={
                <MechanicalTest />
            }
          />
          <Route
            path="/spatial_test"
            element={
                <SpatialReasoningTest />
            }
          />
          <Route
            path="/abstract_test"
            element={
                <AbstractTestApp />
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />  
              </ProtectedRoute>
            }
          />
          <Route
            path="/test_home"
            element={
                <TestHome />
            }
          />
          {/* Add more routes as needed */}
        </Routes>
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
  </React.StrictMode>
);
