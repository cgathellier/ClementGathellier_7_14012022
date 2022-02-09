/*
  Warnings:

  - A unique constraint covering the columns `[id,authorId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Post_authorId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_authorId_key" ON "Post"("id", "authorId");
