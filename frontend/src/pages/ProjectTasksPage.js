import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api/api";
import TaskList from "../components/TaskList";
import TaskDetail from "./TaskDetail";
import Home from "../components/AppBar"
import AppTable from "../components/AppTable";
export default function ProjectTasksPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  return (
    <div className="projects">
      
      <Home />
      <h1>Proyectos</h1>
      <AppTable data={projects} />      
    </div>
  );
}