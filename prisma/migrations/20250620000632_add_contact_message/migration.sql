-- CreateEnum
CREATE TYPE "ContactMessageType" AS ENUM ('support', 'feedback', 'featureRequest', 'other');

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ContactMessageType" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);
