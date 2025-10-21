import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UsersPage from "./pages/UsersPage";
import ProjectTasksPage from "./pages/ProjectTasksPage";
import TaskDetail from "./pages/TaskDetail";
import "./index.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem("token"));
  };

  

  return (
    <Router>
      <div className="App">
        {!token ? (
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<LoginPage onAuthSuccess={handleLoginSuccess} />} />
          </Routes>
        ) : (
          <>
            <Routes>
              <Route path="/"element={<UsersPage />} />
              <Route path="/projects/:id" element={<ProjectTasksPage />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
