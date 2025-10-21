import express from "express";
import {
    createComment,
    getComments,
    deleteComment,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Crear comentario
router.post("/", authMiddleware, createComment);

// Obtener comentarios (por proyecto o por tarea)
router.get("/:projectId", authMiddleware, getComments);

// Eliminar comentario
router.delete("/:id", authMiddleware, deleteComment);

export default router;
