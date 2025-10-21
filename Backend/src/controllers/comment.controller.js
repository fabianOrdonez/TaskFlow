import Comment from "../models/comment.model.js";
import Project from "../models/project.model.js";

// Crear comentario
export const createComment = async (req, res) => {
    try {
        const { projectId, taskId, content } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

        // Validar si el usuario pertenece al proyecto
        if (!project.members.map(id => id.toString()).includes(req.user._id.toString())) {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        const comment = await Comment.create({
            content,
            author: req.user._id,
            project: projectId,
            task: taskId || null,
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error("Error creando comentario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener comentarios de un proyecto (o tarea)
export const getComments = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { taskId } = req.query;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

        if (!project.members.map(id => id.toString()).includes(req.user._id.toString())) {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        const filter = { project: projectId };
        if (taskId) filter.task = taskId;

        const comments = await Comment.find(filter)
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error("Error obteniendo comentarios:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar comentario
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id).populate("project");
        if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });

        const project = comment.project;
        if (!project.members.map(id => id.toString()).includes(req.user._id.toString())) {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Solo el autor puede eliminar su comentario" });
        }

        await comment.deleteOne();
        res.json({ message: "Comentario eliminado correctamente" });
    } catch (error) {
        console.error("Error eliminando comentario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
