-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "profileId" INTEGER;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
