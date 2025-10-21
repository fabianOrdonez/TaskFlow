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
import { addProjects, updateProjects, fetchUsers } from "../api/api";

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

    const [form, setForm] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        color: "",
        status: "Sin_inicial",
        members: [],
    });

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // 🔹 Cargar usuarios
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

    // 🔹 Cargar datos si se está editando
    useEffect(() => {
        if (isEditing) {
            setForm({
                name: userToEdit.name || "",
                description: userToEdit.description || "",
                startDate: userToEdit.startDate || "",
                endDate: userToEdit.endDate || "",
                color: userToEdit.color || "",
                status: userToEdit.status || "Sin_inicial",
                members: userToEdit.members?.map((u) => u._id || u) || [],
            });
        } else {
            setForm({
                name: "",
                description: "",
                startDate: "",
                endDate: "",
                color: "",
                status: "Sin_inicial",
                members: [],
            });
        }
    }, [userToEdit, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si el campo es "members", aseguramos que sea un array
        if (name === "members") {
            setForm({ ...form, [name]: typeof value === "string" ? value.split(",") : value });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await updateProjects(userToEdit._id, form);
                alert("Proyecto actualizado");
            } else {
                await addProjects(
                    form.name,
                    form.description,
                    form.startDate,
                    form.endDate,
                    form.color,
                    form.status,
                    form.members
                );
                alert("Proyecto registrado");
            }

            onSuccess && onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error al guardar Proyecto");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" gutterBottom>
                    {isEditing ? "Editar Proyecto" : "Registrar Proyecto"}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={form.name}
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
                        name="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        helperText="Fecha de inicio"
                    />

                    <TextField
                        helperText="Fecha de finalización"
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        select
                        label="Estado"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Sin_inicial">Sin inicial</MenuItem>
                        <MenuItem value="En proceso">En proceso</MenuItem>
                        <MenuItem value="finished">Finalizado</MenuItem>
                        <MenuItem value="archived">Archivado</MenuItem>
                    </TextField>

                    <TextField
                        select
                        label="Color"
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="#ff0000ff">Rojo</MenuItem>
                        <MenuItem value="#09ff00ff">Verde</MenuItem>
                        <MenuItem value="#0051ffff">Azul</MenuItem>
                    </TextField>

                    {/* 🔹 Campo nuevo: Participantes */}
                    {loadingUsers ? (
                        <Box sx={{ textAlign: "center", mt: 2 }}>
                            <CircularProgress size={24} />
                            <Typography variant="body2">Cargando usuarios...</Typography>
                        </Box>
                    ) : (
                        <TextField
                            select
                            label="Participantes"
                            name="members"
                            value={form.members}
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
