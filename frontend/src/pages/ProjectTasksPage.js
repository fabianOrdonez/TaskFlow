import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api/api";
import Home from "../components/AppBar"
import AppTable from "../components/AppTable";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
export default function ProjectTasksPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  return (
    <div className="projects">
      <Home />
      <h1 align="center">Proyectos</h1>
      <AppTable data={projects} typeData={"projects"} />
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  );
}