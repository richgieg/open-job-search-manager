-- DropForeignKey
ALTER TABLE "ApplicationQuestion" DROP CONSTRAINT "ApplicationQuestion_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_jobId_fkey";

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationQuestion" ADD CONSTRAINT "ApplicationQuestion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
