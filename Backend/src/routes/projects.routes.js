import express from "express";
import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  archiveProject,
  addMember,
  removeMember,
} from "../controllers/projects.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/")
  .post(authMiddleware, createProject)
  .get(authMiddleware, getMyProjects);

router.route("/:id")
  .get(authMiddleware, getProjectById)
  .put(authMiddleware, updateProject)
  .delete(authMiddleware, archiveProject);

router.route("/:id/members")
  .post(authMiddleware, addMember)
  .delete(authMiddleware, removeMember);

export default router;
