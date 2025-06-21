import { RESUME_TEMPLATES } from "@/constants";
import { t } from "@/translate";
import React, { useState } from "react";
import { ProfileEditor } from "./ProfileEditor";
import { WorkEntryEditor } from "./WorkEntryEditor";
import { WorkEntryBulletEditor } from "./WorkEntryBulletEditor";
import { EducationEntryEditor } from "./EducationEntryEditor";
import { EducationEntryBulletEditor } from "./EducationEntryBulletEditor";
import { CertificationEditor } from "./CertificationEditor";
import { SkillCategoryEditor } from "./SkillCategoryEditor";
import { SkillEditor } from "./SkillEditor";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";
import { ResumeTemplate } from "@/generated/prisma";
import { useFullProfileContext } from "./FullProfileContext";
import { usePromptGenerators } from "./usePromptGenerators";
import { useProfileMutations } from "./useProfileMutations";
import { useWorkEntryMutations } from "./useWorkEntryMutations";
import { useWorkEntryBulletMutations } from "./useWorkEntryBulletMutations";
import { useEducationEntryMutations } from "./useEducationEntryMutations";
import { useEducationEntryBulletMutations } from "./useEducationEntryBulletMutations";
import { useCertificationMutations } from "./useCertificationMutations";
import { useSkillCategoryMutations } from "./useSkillCategoryMutations";
import { useSkillMutations } from "./useSkillMutations";

export function MainContent() {
  const [previewTemplate, setPreviewTemplate] =
    useState<ResumeTemplate>("template01");

  const { fullProfile } = useFullProfileContext();
  const { generateSummaryPrompt, generateCoverLetterPrompt } =
    usePromptGenerators();
  const { updateProfile } = useProfileMutations();
  const {
    createWorkEntry,
    updateWorkEntry,
    deleteWorkEntry,
    moveWorkEntryUp,
    moveWorkEntryDown,
  } = useWorkEntryMutations();
  const {
    createWorkEntryBullet,
    updateWorkEntryBullet,
    deleteWorkEntryBullet,
    moveWorkEntryBulletUp,
    moveWorkEntryBulletDown,
  } = useWorkEntryBulletMutations();
  const {
    createEducationEntry,
    updateEducationEntry,
    deleteEducationEntry,
    moveEducationEntryUp,
    moveEducationEntryDown,
  } = useEducationEntryMutations();
  const {
    createEducationEntryBullet,
    updateEducationEntryBullet,
    deleteEducationEntryBullet,
    moveEducationEntryBulletUp,
    moveEducationEntryBulletDown,
  } = useEducationEntryBulletMutations();
  const {
    createCertification,
    updateCertification,
    deleteCertification,
    moveCertificationUp,
    moveCertificationDown,
  } = useCertificationMutations();
  const {
    createSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    moveSkillCategoryUp,
    moveSkillCategoryDown,
  } = useSkillCategoryMutations();
  const { createSkill, updateSkill, deleteSkill, moveSkillUp, moveSkillDown } =
    useSkillMutations();

  return (
    <div className="px-8 pb-28">
      <label className="block">
        <select
          value={previewTemplate}
          onChange={(e) => setPreviewTemplate(e.target.value as ResumeTemplate)}
        >
          {RESUME_TEMPLATES.map((resumeTemplate) => (
            <option key={resumeTemplate} value={resumeTemplate}>
              {t.resumeTemplates[resumeTemplate]}
            </option>
          ))}
        </select>
      </label>
      <Link
        href={`/api/profiles/${fullProfile.pid}/previewResume?template=${previewTemplate}`}
      >
        PREVIEW RESUME
      </Link>
      <br />
      <Link
        href={`/api/profiles/${
          fullProfile.pid
        }/previewCoverLetter?template=${previewTemplate}&timezoneOffset=${new Date().getTimezoneOffset()}`}
      >
        PREVIEW COVER LETTER
      </Link>
      <SectionHeading text="Basic Info" />
      <ProfileEditor
        profile={fullProfile}
        updateProfile={updateProfile}
        generateSummaryPrompt={generateSummaryPrompt}
        generateCoverLetterPrompt={generateCoverLetterPrompt}
      />
      <SectionHeading text="Skills" />
      <div className="mt-6 flex flex-col gap-12">
        {fullProfile.skillCategories.map((skillCategory) => (
          <div key={skillCategory.id} className="flex flex-col gap-6">
            <SkillCategoryEditor
              skillCategory={skillCategory}
              updateSkillCategory={updateSkillCategory}
              deleteSkillCategory={deleteSkillCategory}
              moveSkillCategoryUp={moveSkillCategoryUp}
              moveSkillCategoryDown={moveSkillCategoryDown}
            />
            {skillCategory.skills.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {skillCategory.skills.map((s) => (
                  <SkillEditor
                    key={s.id}
                    skill={s}
                    skillCategoryEnabled={skillCategory.enabled}
                    updateSkill={updateSkill}
                    deleteSkill={deleteSkill}
                    moveSkillUp={moveSkillUp}
                    moveSkillDown={moveSkillDown}
                  />
                ))}
              </div>
            )}
            <div>
              <button onClick={() => createSkill(skillCategory.pid)}>
                New Skill
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={createSkillCategory}>New Skill Category</button>
      <SectionHeading text="Work Experience" />
      <div className="mt-6 flex flex-col gap-12">
        {fullProfile.workEntries.map((workEntry) => (
          <div key={workEntry.id} className="flex flex-col gap-6">
            <WorkEntryEditor
              workEntry={workEntry}
              updateWorkEntry={updateWorkEntry}
              deleteWorkEntry={deleteWorkEntry}
              moveWorkEntryUp={moveWorkEntryUp}
              moveWorkEntryDown={moveWorkEntryDown}
            />
            {workEntry.bullets.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {workEntry.bullets.map((b) => (
                  <WorkEntryBulletEditor
                    key={b.id}
                    workEntryBullet={b}
                    workEntryEnabled={workEntry.enabled}
                    updateWorkEntryBullet={updateWorkEntryBullet}
                    deleteWorkEntryBullet={deleteWorkEntryBullet}
                    moveWorkEntryBulletUp={moveWorkEntryBulletUp}
                    moveWorkEntryBulletDown={moveWorkEntryBulletDown}
                  />
                ))}
              </div>
            )}
            <div>
              <button onClick={() => createWorkEntryBullet(workEntry.pid)}>
                New Bullet
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={createWorkEntry}>New Work</button>
      <SectionHeading text="Education" />
      <div className="mt-6 flex flex-col gap-12">
        {fullProfile.educationEntries.map((educationEntry) => (
          <div key={educationEntry.id} className="flex flex-col gap-6">
            <EducationEntryEditor
              educationEntry={educationEntry}
              updateEducationEntry={updateEducationEntry}
              deleteEducationEntry={deleteEducationEntry}
              moveEducationEntryUp={moveEducationEntryUp}
              moveEducationEntryDown={moveEducationEntryDown}
            />
            {educationEntry.bullets.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {educationEntry.bullets.map((b) => (
                  <EducationEntryBulletEditor
                    key={b.id}
                    educationEntryBullet={b}
                    educationEntryEnabled={educationEntry.enabled}
                    updateEducationEntryBullet={updateEducationEntryBullet}
                    deleteEducationEntryBullet={deleteEducationEntryBullet}
                    moveEducationEntryBulletUp={moveEducationEntryBulletUp}
                    moveEducationEntryBulletDown={moveEducationEntryBulletDown}
                  />
                ))}
              </div>
            )}
            <div>
              <button
                onClick={() => createEducationEntryBullet(educationEntry.pid)}
              >
                New Bullet
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={createEducationEntry}>New Education</button>
      <SectionHeading text="Certifications" />
      <div className="mt-6 flex flex-col gap-6">
        {fullProfile.certifications.length > 0 && (
          <div className="flex flex-col gap-4">
            {fullProfile.certifications.map((certification) => (
              <CertificationEditor
                key={certification.id}
                certification={certification}
                updateCertification={updateCertification}
                deleteCertification={deleteCertification}
                moveCertificationUp={moveCertificationUp}
                moveCertificationDown={moveCertificationDown}
              />
            ))}
          </div>
        )}
        <div>
          <button onClick={createCertification}>New Certification</button>
        </div>
      </div>
    </div>
  );
}
