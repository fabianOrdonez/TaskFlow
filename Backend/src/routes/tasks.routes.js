import express from "express";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/project/:projectId")
  .get(authMiddleware, getTasksByProject)
  .post(authMiddleware, createTask);

router.route("/:id")
  .put(authMiddleware, updateTask)
  .delete(authMiddleware, deleteTask);

export default router;
