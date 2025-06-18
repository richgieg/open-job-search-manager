-- CreateTable
CREATE TABLE "ResumeWorkEntry" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLocation" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "JobType" NOT NULL,
    "arrangement" "JobArrangement" NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "resumeId" INTEGER NOT NULL,

    CONSTRAINT "ResumeWorkEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeWorkEntryBullet" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "workEntryId" INTEGER NOT NULL,

    CONSTRAINT "ResumeWorkEntryBullet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeEducationEntry" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "schoolLocation" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "graduationDate" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "resumeId" INTEGER NOT NULL,

    CONSTRAINT "ResumeEducationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeEducationEntryBullet" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "educationEntryId" INTEGER NOT NULL,

    CONSTRAINT "ResumeEducationEntryBullet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeCertification" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "resumeId" INTEGER NOT NULL,

    CONSTRAINT "ResumeCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeSkillCategory" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "resumeId" INTEGER NOT NULL,

    CONSTRAINT "ResumeSkillCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeSkill" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "skillCategoryId" INTEGER NOT NULL,

    CONSTRAINT "ResumeSkill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResumeWorkEntry_pid_key" ON "ResumeWorkEntry"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeWorkEntryBullet_pid_key" ON "ResumeWorkEntryBullet"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeEducationEntry_pid_key" ON "ResumeEducationEntry"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeEducationEntryBullet_pid_key" ON "ResumeEducationEntryBullet"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeCertification_pid_key" ON "ResumeCertification"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeSkillCategory_pid_key" ON "ResumeSkillCategory"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeSkill_pid_key" ON "ResumeSkill"("pid");

-- AddForeignKey
ALTER TABLE "ResumeWorkEntry" ADD CONSTRAINT "ResumeWorkEntry_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeWorkEntryBullet" ADD CONSTRAINT "ResumeWorkEntryBullet_workEntryId_fkey" FOREIGN KEY ("workEntryId") REFERENCES "ResumeWorkEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeEducationEntry" ADD CONSTRAINT "ResumeEducationEntry_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeEducationEntryBullet" ADD CONSTRAINT "ResumeEducationEntryBullet_educationEntryId_fkey" FOREIGN KEY ("educationEntryId") REFERENCES "ResumeEducationEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeCertification" ADD CONSTRAINT "ResumeCertification_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeSkillCategory" ADD CONSTRAINT "ResumeSkillCategory_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeSkill" ADD CONSTRAINT "ResumeSkill_skillCategoryId_fkey" FOREIGN KEY ("skillCategoryId") REFERENCES "ResumeSkillCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
