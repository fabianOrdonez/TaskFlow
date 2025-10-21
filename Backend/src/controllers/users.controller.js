import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { updateUserSchema } from '../validators/user.validator.js';

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Editar perfil del usuario autenticado
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const updates = {};
    if (value.name) updates.name = value.name;
    if (value.avatarUrl) updates.avatarUrl = value.avatarUrl;

    // Si se envía contraseña nueva
    if (value.password) {
      const hashed = await bcrypt.hash(value.password, 12);
      updates.passwordHash = hashed;
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true })
      .select('-passwordHash');

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Listar todos los usuarios (solo admin o líder)
 */
export const listUsers = async (req, res, next) => {
  try {
    if (!['leader', 'admin'].includes(req.user.role))
      return res.status(403).json({ message: 'No autorizado' });

    const users = await User.find().select('name email role');
    res.json(users);
  } catch (err) {
    next(err);
  }
};
