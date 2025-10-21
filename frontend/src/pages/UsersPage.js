import React from "react";
import UserList from "../components/UserList";
import Home from "../components/AppBar"
import Table from "../components/AppTable"

import AddIcon from '@mui/icons-material/Add';
import { Fab } from "@mui/material";
export default function UsersPage() {
  return (
    <div>
      <Home />
      <h1 align="center">Gestión de Usuarios</h1>
      <UserList />
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  );
}