-- CreateEnum
CREATE TYPE "ResumeTemplate" AS ENUM ('template01', 'template02');

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "profileName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "websiteText" TEXT NOT NULL,
    "websiteLink" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "coverLetter" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "resumeName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "websiteText" TEXT NOT NULL,
    "websiteLink" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "allowPageBreaks" BOOLEAN NOT NULL,
    "template" "ResumeTemplate" NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_pid_key" ON "Profile"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_pid_key" ON "Resume"("pid");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
