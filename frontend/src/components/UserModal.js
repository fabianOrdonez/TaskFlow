import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
} from "@mui/material";
import { registerUser, updateUser } from "../api/api";

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

export default function UserFormModal({ open, onClose, onSuccess, userToEdit }) {
    const isEditing = !!userToEdit;

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "colaborador",
    });

    useEffect(() => {
        if (isEditing) {
            setForm({
                name: userToEdit.name || "",
                email: userToEdit.email || "",
                password: "",
                role: userToEdit.role || "colaborador",
            });
        } else {
            setForm({ name: "", email: "", password: "", role: "colaborador" });
        }
    }, [userToEdit, isEditing]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await updateUser(userToEdit._id, form);
                alert("Usuario actualizado ");
            } else {
                await registerUser(form.name, form.email, form.password);
                alert("Usuario registrado ");
            }

            onSuccess && onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error al guardar usuario ");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" gutterBottom>
                    {isEditing ? "Editar Usuario" : "Registrar Usuario"}
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
                        label="Correo"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        disabled={isEditing}
                    />

                    {!isEditing && (
                        <TextField
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    )}

                    <TextField
                        select
                        label="Rol"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="colaborador">Colaborador</MenuItem>
                        <MenuItem value="líder">Líder</MenuItem>
                        <MenuItem value="admin">Administrador</MenuItem>
                    </TextField>

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        {isEditing ? "Guardar cambios" : "Registrar"}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}
