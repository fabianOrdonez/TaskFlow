
import React from "react";
import {
  Modal,
  Box,
} from "@mui/material";

import AppDashboard from "../components/Appdashboard";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function TaskDashboard({ open, onClose, onSuccess, userToEdit }) {
  const ToEdit = userToEdit ?? {};

  const nameproject = ToEdit !== null || ToEdit.name !== null || ToEdit.name !== undefined ? ToEdit.name : " Task";

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <h1 align="center">Dashboard de tareas del {nameproject}</h1>
        <AppDashboard type={"Task"} toEdit={ToEdit} />
      </Box>
    </Modal>
  );
}
