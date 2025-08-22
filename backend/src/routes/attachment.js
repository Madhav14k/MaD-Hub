import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

// Upload attachment to a task
router.post('/:taskId', authenticateToken, upload.single('file'), async (req, res) => {
  const { taskId } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  const attachment = await prisma.attachment.create({
    data: {
      url: `/uploads/${file.filename}`,
      filename: file.originalname,
      taskId: Number(taskId)
    }
  });
  // Emit real-time event
  const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
  if (task) req.app.get('io').to(`project_${task.projectId}`).emit('attachmentAdded', taskId);
  res.json(attachment);
});

// Download attachment
router.get('/download/:filename', authenticateToken, async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join('uploads', filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.download(filePath);
});

export default router;
