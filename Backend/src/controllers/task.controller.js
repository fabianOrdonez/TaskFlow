import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

//  Crear tarea
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const { projectId } = req.params;

    // Verificar proyecto
    const project = await Project.findById(projectId).populate("members", "_id");
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

    // Validar que el usuario sea miembro
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "No tienes acceso a este proyecto" });
    }

    // Validar que el asignado sea miembro
    const assignedMember = project.members.find(
      (m) => m._id.toString() === assignedTo
    );
    if (!assignedMember) {
      return res
        .status(400)
        .json({ message: "No puedes asignar tareas a un usuario fuera del proyecto" });
    }

    // Crear tarea
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      project: projectId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Obtener tareas por proyecto
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate("members", "_id");
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "No tienes acceso a este proyecto" });
    }

    const { estado, titulo } = req.query;
    const query = { project: projectId };

    if (estado) query.status = estado;
    if (titulo) query.title = new RegExp(titulo, "i");

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Actualizar estado o detalles de tarea
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate("project");

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    const project = await Project.findById(task.project._id).populate("members", "_id");

    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "No tienes acceso a este proyecto" });
    }

    // Solo se pueden actualizar campos válidos
    const allowed = ["title", "description", "priority", "status", "dueDate", "assignedTo"];
    for (let key of Object.keys(req.body)) {
      if (allowed.includes(key)) task[key] = req.body[key];
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Eliminar tarea
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate("project");

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    const project = await Project.findById(task.project._id).populate("members", "_id");

    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "No tienes acceso a este proyecto" });
    }

    await task.deleteOne();
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
