import React from "react";
import { loginUser } from "../api/api";
import LoginForm from "../components/LoginForm";

function LoginPage({ onAuthSuccess }) {
  const handleLogin = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      onAuthSuccess(); // Redirigir al dashboard o similar
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div className="page-container">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default LoginPage;
