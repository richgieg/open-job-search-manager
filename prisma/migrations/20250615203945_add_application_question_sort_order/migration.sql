/*
  Warnings:

  - Added the required column `sortOrder` to the `ApplicationQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApplicationQuestion" ADD COLUMN     "sortOrder" INTEGER NOT NULL;
