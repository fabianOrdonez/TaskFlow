import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api/api";
import Home from "../components/AppBar"
import AppTable from "../components/AppTable";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ProjectsFormModal from "../components/ProyectosModal"
export default function ProjectTasksPage() {
  const [projects, setProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  return (
    <div className="projects">
      <Home />
      <h1 align="center">Proyectos</h1>
      <AppTable data={projects} typeData={"projects"} />
      <Fab onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }} color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <ProjectsFormModal
        open={openModal}
        onClose={handleClose}
        onSuccess={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
}