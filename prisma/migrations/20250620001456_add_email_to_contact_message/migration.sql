/*
  Warnings:

  - Added the required column `email` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "email" TEXT NOT NULL;
