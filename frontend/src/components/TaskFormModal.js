import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { addTask, updateTask, fetchUsers } from "../api/api";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function ProjectsFormModal({ open, onClose, onSuccess, userToEdit }) {
    const isEditing = !!userToEdit;
    const idProject = userToEdit !== null ?? userToEdit;

    const [form, setForm] = useState({
        id_Project: idProject ? userToEdit._id : "",
        title: "",
        description: "",
        priority: "baja",
        dueDate: "",
        assignedTo: [],
    });

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    //  Cargar usuarios
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetchUsers();
                setUsers(res);
            } catch (err) {
                console.error("Error cargando usuarios:", err);
            } finally {
                setLoadingUsers(false);
            }
        };
        loadUsers();
    }, []);

    // Cargar datos si se está editando
    useEffect(() => {
        if (isEditing) {
            setForm({
                id_Project: idProject ? userToEdit._id : "",
                title: userToEdit.title || "",
                description: userToEdit.description || "",
                description: userToEdit.description || "",
                dueDate: userToEdit.dueDate || "",
                assignedTo: userToEdit.assignedTo?.map((u) => u._id || u) || [],
            });
        } else {
            setForm({
                id_Project: idProject ? userToEdit._id : "",
                title: "",
                description: "",
                priority: "baja",
                dueDate: "",
                assignedTo: [],
            });
        }
    }, [userToEdit, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si el campo es "assignedTo", aseguramos que sea un array
        if (name === "assignedTo") {
            setForm({ ...form, [name]: typeof value === "string" ? value.split(",") : value });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!isEditing) {
                await updateTask(userToEdit._id, form);
                alert("Tarea actualizado");
            } else {
                await addTask(
                    form.title,
                    form.description,
                    form.priority,
                    form.dueDate,
                    form.assignedTo,
                    idProject ? userToEdit._id : "",
                );
                alert("Tarea registrado");
            }

            onSuccess && onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error al guardar Tarea");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" gutterBottom>
                    {"Registrar tarea"}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Descripción"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        name="dueDate"
                        type="date"
                        value={form.dueDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{
                            min: new Date().toISOString().split("T")[0],
                        }}
                        helperText="Fecha de Vencimiento"
                    />


                    <TextField
                        select
                        label="Prioridad"
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="baja">Baja</MenuItem>
                        <MenuItem value="media">Media</MenuItem>
                        <MenuItem value="alta">Alta</MenuItem>
                    </TextField>


                    {/*  Campo nuevo: Participantes */}
                    {loadingUsers ? (
                        <Box sx={{ textAlign: "center", mt: 2 }}>
                            <CircularProgress size={24} />
                            <Typography variant="body2">Cargando usuarios...</Typography>
                        </Box>
                    ) : (
                        <TextField
                            select
                            label="Asignado a"
                            name="assignedTo"
                            value={form.assignedTo}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            SelectProps={{ multiple: true }}
                            helperText="Selecciona uno o varios usuarios"
                        >
                            {users.map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        {isEditing ? "Guardar cambios" : "Registrar"}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}
