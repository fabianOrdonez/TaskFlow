import React, { useState } from "react";
import UserList from "../components/UserList";
import Home from "../components/AppBar"
import UserFormModal from "../components/UserModal"

import AddIcon from '@mui/icons-material/Add';
import { Fab } from "@mui/material";
export default function UsersPage() {
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const reloadUsers = () => setRefresh(!refresh);
  return (
    <div>
      <Home />
      <h1 align="center">Gestión de Usuarios</h1>
      <UserList refresh={refresh} typeData={"users"} />
      <Fab onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }} color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <UserFormModal
        open={openModal}
        onClose={handleClose}
        onSuccess={() => {
          reloadUsers();
          setOpenModal(false);
        }}
      />
    </div>
  );
}