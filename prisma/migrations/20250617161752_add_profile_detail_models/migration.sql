-- CreateTable
CREATE TABLE "WorkEntry" (
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
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "WorkEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkEntryBullet" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "workEntryId" INTEGER NOT NULL,

    CONSTRAINT "WorkEntryBullet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationEntry" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "schoolLocation" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "graduationDate" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "EducationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationEntryBullet" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "educationEntryId" INTEGER NOT NULL,

    CONSTRAINT "EducationEntryBullet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillCategory" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "SkillCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "pid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "skillCategoryId" INTEGER NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkEntry_pid_key" ON "WorkEntry"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "WorkEntryBullet_pid_key" ON "WorkEntryBullet"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "EducationEntry_pid_key" ON "EducationEntry"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "EducationEntryBullet_pid_key" ON "EducationEntryBullet"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "Certification_pid_key" ON "Certification"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "SkillCategory_pid_key" ON "SkillCategory"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_pid_key" ON "Skill"("pid");

-- AddForeignKey
ALTER TABLE "WorkEntry" ADD CONSTRAINT "WorkEntry_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkEntryBullet" ADD CONSTRAINT "WorkEntryBullet_workEntryId_fkey" FOREIGN KEY ("workEntryId") REFERENCES "WorkEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationEntry" ADD CONSTRAINT "EducationEntry_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationEntryBullet" ADD CONSTRAINT "EducationEntryBullet_educationEntryId_fkey" FOREIGN KEY ("educationEntryId") REFERENCES "EducationEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillCategory" ADD CONSTRAINT "SkillCategory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_skillCategoryId_fkey" FOREIGN KEY ("skillCategoryId") REFERENCES "SkillCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
