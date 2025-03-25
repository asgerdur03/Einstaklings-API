/*
  Warnings:

  - Made the column `imageUrl` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `caption` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `profilePic` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Color" AS ENUM ('BLACK', 'ORANGE', 'GRAY', 'WHITE', 'MIXED', 'BROWN', 'TABBY', 'CALICO', 'TORTOISESHELL');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('FRIENDLY', 'SCARED', 'CURIOUS', 'PLAYFUL', 'ANGRY', 'SLEEPY', 'ALERT');

-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'CHONKY');

-- CreateEnum
CREATE TYPE "Age" AS ENUM ('KITTEN', 'ADULT', 'SENIOR');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "age" "Age",
ADD COLUMN     "color" "Color",
ADD COLUMN     "mood" "Mood",
ADD COLUMN     "size" "Size",
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "caption" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePic" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
