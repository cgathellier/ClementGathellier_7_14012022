/*
  Warnings:

  - You are about to drop the column `text` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `admin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `superAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikesOnComments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikesOnPosts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnComments" DROP CONSTRAINT "LikesOnComments_commentId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnComments" DROP CONSTRAINT "LikesOnComments_userId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPosts" DROP CONSTRAINT "LikesOnPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPosts" DROP CONSTRAINT "LikesOnPosts_userId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "text",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "admin",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "superAdmin",
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "LikesOnComments";

-- DropTable
DROP TABLE "LikesOnPosts";

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "bio" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
