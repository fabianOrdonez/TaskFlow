import * as React from "react";
import CommentList from "../components/CommentList";
import Home from "../components/AppBar"
import AppDashboard from "../components/Appdashboard";

export default function TaskDetail() {

  return (
    <div className="task-detail">
      <Home />
      <h1 align="center">Dashboard</h1>
      <AppDashboard />

    </div>
  );
}