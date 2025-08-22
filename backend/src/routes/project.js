
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { requireProjectOwner, requireProjectMember } from '../middleware/projectRole.js';
import { generateInviteCode } from '../utils/generateInviteCode.js';

const router = express.Router();
const prisma = new PrismaClient();
// Get project detail (with tasks and members)
router.get('/:id', authenticateToken, async (req, res) => {
  const projectId = Number(req.params.id);
  // Check membership
  const membership = await prisma.projectMembership.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId } },
  });
  if (!membership) return res.status(403).json({ error: 'Not a project member' });
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const tasks = await prisma.task.findMany({
    where: { projectId },
    include: { assignee: true, comments: { include: { user: true } }, attachments: true }
  });
  const members = await prisma.projectMembership.findMany({
    where: { projectId },
    include: { user: true }
  });
  res.json({ project, tasks, members });
});

// Get projects for user
router.get('/', authenticateToken, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      memberships: { some: { userId: req.user.id } }
    },
    include: { memberships: true }
  });
  res.json(projects);
});

// Create project
router.post('/', authenticateToken, async (req, res) => {
  const { name, description, deadline } = req.body;
  const inviteCode = generateInviteCode();
  const project = await prisma.project.create({
    data: {
      name, description, deadline: new Date(deadline), ownerId: req.user.id, inviteCode,
      memberships: { create: { userId: req.user.id, role: 'owner' } }
    }
  });
  res.json(project);
});

// Join project via invite code
router.post('/join', authenticateToken, async (req, res) => {
  const { inviteCode } = req.body;
  const project = await prisma.project.findUnique({ where: { inviteCode } });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  await prisma.projectMembership.upsert({
    where: { userId_projectId: { userId: req.user.id, projectId: project.id } },
    update: {},
    create: { userId: req.user.id, projectId: project.id, role: 'member' }
  });
  res.json({ message: 'Joined project' });
});

// Only owner can delete a project
router.delete('/:projectId', authenticateToken, requireProjectOwner, async (req, res) => {
  const { projectId } = req.params;
  await prisma.project.delete({ where: { id: Number(projectId) } });
  res.json({ message: 'Project deleted' });
});

export default router;
