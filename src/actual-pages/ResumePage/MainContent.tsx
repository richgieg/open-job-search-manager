import { ResumeEditor } from "./ResumeEditor";
import React, { useState } from "react";
import { WorkEntryEditor } from "./WorkEntryEditor";
import { WorkEntryBulletEditor } from "./WorkEntryBulletEditor";
import { EducationEntryEditor } from "./EducationEntryEditor";
import { EducationEntryBulletEditor } from "./EducationEntryBulletEditor";
import { CertificationEditor } from "./CertificationEditor";
import { SkillCategoryEditor } from "./SkillCategoryEditor";
import { SkillEditor } from "./SkillEditor";
import { SectionHeading } from "@/components";
import NextLink from "next/link";
import {
  ApplicationQuestion,
  Contact,
  Job,
  Link,
  Resume,
} from "@/generated/prisma";
import { useFullResumeContext } from "./FullResumeContext";
import {
  useCertificationMutations,
  useEducationEntryBulletMutations,
  useEducationEntryMutations,
  useSkillCategoryMutations,
  useWorkEntryBulletMutations,
  useWorkEntryMutations,
} from "./mutations";
import { useSkillMutations } from "./mutations/useSkillMutations";

type FullJob = Job & {
  resumes: Resume[];
  links: Link[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

type Props = {
  fullJob: FullJob;
};

export function MainContent({ fullJob }: Props) {
  const [selectedContactPid, setSelectedContactPid] = useState<string>(
    fullJob.contacts[0]?.pid ?? ""
  );

  const { fullResume } = useFullResumeContext();
  const { createWorkEntry } = useWorkEntryMutations();
  const { createWorkEntryBullet } = useWorkEntryBulletMutations();
  const { createEducationEntry } = useEducationEntryMutations();
  const { createEducationEntryBullet } = useEducationEntryBulletMutations();
  const { createCertification } = useCertificationMutations();
  const { createSkillCategory } = useSkillCategoryMutations();
  const { createSkill } = useSkillMutations();

  return (
    <div className="px-8 pb-28">
      <NextLink href={`/api/resumes/${fullResume.pid}/downloadResume`}>
        DOWNLOAD RESUME
      </NextLink>
      {fullJob.contacts.length > 0 && (
        <>
          <br />
          <select
            value={selectedContactPid}
            onChange={(e) => setSelectedContactPid(e.target.value)}
          >
            {fullJob.contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <br />
        </>
      )}
      {selectedContactPid && (
        <>
          <NextLink
            href={`/api/resumes/${
              fullResume.pid
            }/downloadCoverLetter?contactPid=${selectedContactPid}&timezoneOffset=${new Date().getTimezoneOffset()}`}
          >
            DOWNLOAD COVER LETTER
          </NextLink>
          <br />
          <NextLink
            href={`/api/resumes/${
              fullResume.pid
            }/downloadCoverLetter?contactPid=${selectedContactPid}&timezoneOffset=${new Date().getTimezoneOffset()}&includeResume=true`}
          >
            DOWNLOAD COVER LETTER WITH RESUME
          </NextLink>
        </>
      )}
      <br />
      <NextLink href={`/resumes/${fullResume.pid}/application`}>
        APPLICATION
      </NextLink>
      <SectionHeading text="Basic Info" />
      <ResumeEditor resume={fullResume} fullJob={fullJob} />
      <SectionHeading text="Skills" />
      <div className="mt-6 flex flex-col gap-12">
        {fullResume.skillCategories.map((skillCategory) => (
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
        {fullResume.workEntries.map((workEntry) => (
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
        {fullResume.educationEntries.map((educationEntry) => (
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
        {fullResume.certifications.length > 0 && (
          <div className="flex flex-col gap-4">
            {fullResume.certifications.map((certification) => (
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
