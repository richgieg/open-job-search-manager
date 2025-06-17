-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('fullTime', 'partTime', 'contract');

-- CreateEnum
CREATE TYPE "JobArrangement" AS ENUM ('onSite', 'hybrid', 'remote');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('notApplied', 'applied', 'appliedWithdrawn', 'appliedRejected', 'interviewing', 'interviewedWithdrawn', 'interviewedRejected', 'offerReceived', 'offerAccepted');

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" "JobType",
    "arrangement" "JobArrangement",
    "staffingCompany" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "postedDate" TEXT,
    "appliedDate" TEXT,
    "status" "JobStatus" NOT NULL,
    "notes" TEXT NOT NULL,
    "postedSalary" TEXT NOT NULL,
    "desiredSalary" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT NOT NULL,
    "addressLine3" TEXT NOT NULL,
    "addressLine4" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationQuestion" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "ApplicationQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_pid_key" ON "Job"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "Link_pid_key" ON "Link"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_pid_key" ON "Contact"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationQuestion_pid_key" ON "ApplicationQuestion"("pid");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationQuestion" ADD CONSTRAINT "ApplicationQuestion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
