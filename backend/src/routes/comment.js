import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// List comments for a task
router.get('/:taskId', authenticateToken, async (req, res) => {
  const { taskId } = req.params;
  const comments = await prisma.comment.findMany({ where: { taskId: Number(taskId) }, include: { user: true } });
  res.json(comments);
});

// Add comment to a task
router.post('/:taskId', authenticateToken, async (req, res) => {
  const { content } = req.body;
  const { taskId } = req.params;
  const comment = await prisma.comment.create({
    data: {
      content,
      userId: req.user.id,
      taskId: Number(taskId)
    }
  });
  // Emit real-time event
  // Find projectId for this task
  const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
  if (task) req.app.get('io').to(`project_${task.projectId}`).emit('commentAdded', taskId);
  res.json(comment);
});

export default router;
