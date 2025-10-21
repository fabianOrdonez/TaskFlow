import React from "react";
import UserList from "../components/UserList";
import Home from "../components/AppBar"
import Table from "../components/AppTable"

export default function UsersPage() {
  return (
    <div>
      <Home />
      <h1 align="center">Gestión de Usuarios</h1>
      <UserList />
    </div>
  );
}