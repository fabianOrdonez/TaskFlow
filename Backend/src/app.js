import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/users.routes.js';
import usersRoutes from './routes/user.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', authRoutes);
app.use('/api/auth', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/comments', commentsRoutes);

app.use(errorHandler);
export default app;
