/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectId]` on the table `ProjectMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectMembership_userId_projectId_key" ON "ProjectMembership"("userId", "projectId");
