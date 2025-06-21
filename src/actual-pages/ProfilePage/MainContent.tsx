import { RESUME_TEMPLATES } from "@/constants";
import { t } from "@/translate";
import React, { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";
import { ResumeTemplate } from "@/generated/prisma";
import { useFullProfileContext } from "./FullProfileContext";
import { useWorkEntryMutations } from "./useWorkEntryMutations";
import { useWorkEntryBulletMutations } from "./useWorkEntryBulletMutations";
import { useEducationEntryMutations } from "./useEducationEntryMutations";
import { useEducationEntryBulletMutations } from "./useEducationEntryBulletMutations";
import { useCertificationMutations } from "./useCertificationMutations";
import { useSkillCategoryMutations } from "./useSkillCategoryMutations";
import { useSkillMutations } from "./useSkillMutations";
import {
  CertificationEditor,
  EducationEntryBulletEditor,
  EducationEntryEditor,
  ProfileEditor,
  SkillCategoryEditor,
  SkillEditor,
  WorkEntryBulletEditor,
  WorkEntryEditor,
} from "./editors";

export function MainContent() {
  const [previewTemplate, setPreviewTemplate] =
    useState<ResumeTemplate>("template01");

  const { fullProfile } = useFullProfileContext();
  const { createWorkEntry } = useWorkEntryMutations();
  const { createWorkEntryBullet } = useWorkEntryBulletMutations();
  const { createEducationEntry } = useEducationEntryMutations();
  const { createEducationEntryBullet } = useEducationEntryBulletMutations();
  const { createCertification } = useCertificationMutations();
  const { createSkillCategory } = useSkillCategoryMutations();
  const { createSkill } = useSkillMutations();

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
      <ProfileEditor profile={fullProfile} />
      <SectionHeading text="Skills" />
      <div className="mt-6 flex flex-col gap-12">
        {fullProfile.skillCategories.map((skillCategory) => (
          <div key={skillCategory.id} className="flex flex-col gap-6">
            <SkillCategoryEditor skillCategory={skillCategory} />
            {skillCategory.skills.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {skillCategory.skills.map((s) => (
                  <SkillEditor
                    key={s.id}
                    skill={s}
                    skillCategoryEnabled={skillCategory.enabled}
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
            <WorkEntryEditor workEntry={workEntry} />
            {workEntry.bullets.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {workEntry.bullets.map((b) => (
                  <WorkEntryBulletEditor
                    key={b.id}
                    workEntryBullet={b}
                    workEntryEnabled={workEntry.enabled}
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
            <EducationEntryEditor educationEntry={educationEntry} />
            {educationEntry.bullets.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {educationEntry.bullets.map((b) => (
                  <EducationEntryBulletEditor
                    key={b.id}
                    educationEntryBullet={b}
                    educationEntryEnabled={educationEntry.enabled}
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
