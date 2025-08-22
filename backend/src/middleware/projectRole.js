import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Checks if user is a member of the project
export async function requireProjectMember(req, res, next) {
  const projectId = Number(req.params.projectId) || Number(req.body.projectId);
  if (!projectId) return res.status(400).json({ error: 'Project ID required' });
  const membership = await prisma.projectMembership.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId } },
  });
  if (!membership) return res.status(403).json({ error: 'Not a project member' });
  req.membership = membership;
  next();
}

// Checks if user is owner of the project
export async function requireProjectOwner(req, res, next) {
  const projectId = Number(req.params.projectId) || Number(req.body.projectId);
  if (!projectId) return res.status(400).json({ error: 'Project ID required' });
  const membership = await prisma.projectMembership.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId } },
  });
  if (!membership || membership.role !== 'owner') return res.status(403).json({ error: 'Not a project owner' });
  req.membership = membership;
  next();
}
