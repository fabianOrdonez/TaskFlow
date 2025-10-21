import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

//  Generar token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Registrar usuario
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'El usuario ya existe' });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) user.password = password;
    if (role) user.role = role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      active: updatedUser.active,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Login de usuario
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Obtener perfil del usuario logueado
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Desactivar / Activar usuario
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    // Invertir el estado actual
    user.active = !user.active;
    await user.save();

    res.json({
      message: `Usuario ${user.active ? 'activado' : 'desactivado'} correctamente`,
      active: user.active,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
