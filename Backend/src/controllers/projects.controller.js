import Project from "../models/project.model.js";
import User from "../models/user.model.js";

// Crear un nuevo proyecto
export const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, color } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    const project = await Project.create({
      name,
      description,
      startDate,
      endDate,
      color,
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar proyectos del usuario
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id,
      // status: "active",
    }).populate("owner", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ver detalle del proyecto
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });
    const isMember = project.members.some(member => {
      const memberId = (member && member._id) ? member._id : member;
      return memberId.toString() === req.user._id.toString();
    });

    if (!isMember) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Editar proyecto
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Solo el creador puede editar el proyecto" });
    }

    Object.assign(project, req.body);
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Archivar proyecto (soft delete)
export const archiveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Solo el creador puede archivar el proyecto" });
    }

    project.status = "archived";
    await project.save();

    res.json({ message: "Proyecto archivado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar miembro
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Solo el creador puede agregar miembros" });
    }

    const user = await User.findById(userId);    
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remover miembro
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Solo el creador puede remover miembros" });
    }

    project.members = project.members.filter(
      (memberId) => memberId.toString() !== userId
    );
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
