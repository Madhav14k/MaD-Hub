import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { requireProjectMember } from '../middleware/projectRole.js';

const router = express.Router();
const prisma = new PrismaClient();

// List tasks for a project (with filters)
router.get('/:projectId', authenticateToken, requireProjectMember, async (req, res) => {
  const { assignee, status } = req.query;
  const { projectId } = req.params;
  const where = { projectId: Number(projectId) };
  if (assignee) where.assigneeId = Number(assignee);
  if (status) where.status = status;
  const tasks = await prisma.task.findMany({ where, include: { assignee: true, comments: true, attachments: true } });
  res.json(tasks);
});

// Create task (members only)
router.post('/:projectId', authenticateToken, requireProjectMember, async (req, res) => {
  const { title, description, assigneeId } = req.body;
  const { projectId } = req.params;
  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: 'todo',
      projectId: Number(projectId),
      assigneeId: assigneeId ? Number(assigneeId) : null
    }
  });
  // Emit real-time event
  req.app.get('io').to(`project_${projectId}`).emit('taskUpdated');
  res.json(task);
});

// Update task (members only)
router.put('/:taskId', authenticateToken, async (req, res) => {
  const { status, assigneeId, title, description } = req.body;
  const { taskId } = req.params;
  const data = {};
  if (status) data.status = status;
  if (assigneeId !== undefined) data.assigneeId = assigneeId;
  if (title) data.title = title;
  if (description) data.description = description;
  const task = await prisma.task.update({ where: { id: Number(taskId) }, data });
  // Emit real-time event
  const projectId = task.projectId;
  req.app.get('io').to(`project_${projectId}`).emit('taskUpdated');
  res.json(task);
});

// Delete task (members only)
router.delete('/:taskId', authenticateToken, async (req, res) => {
  const { taskId } = req.params;
  const deleted = await prisma.task.delete({ where: { id: Number(taskId) } });
  // Emit real-time event
  const projectId = deleted.projectId;
  req.app.get('io').to(`project_${projectId}`).emit('taskUpdated');
  res.json({ message: 'Task deleted' });
});

export default router;
