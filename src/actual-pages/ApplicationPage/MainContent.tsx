import { t } from "@/translate";
import { MouseEvent, ReactNode } from "react";
import {
  Job,
  Profile,
  Resume,
  ResumeCertification,
  ResumeEducationEntry,
  ResumeEducationEntryBullet,
  ResumeSkill,
  ResumeSkillCategory,
  ResumeWorkEntry,
  ResumeWorkEntryBullet,
} from "@/generated/prisma";

type FullResume = Resume & {
  workEntries: (ResumeWorkEntry & { bullets: ResumeWorkEntryBullet[] })[];
  educationEntries: (ResumeEducationEntry & {
    bullets: ResumeEducationEntryBullet[];
  })[];
  certifications: ResumeCertification[];
  skillCategories: (ResumeSkillCategory & { skills: ResumeSkill[] })[];
  profile: Profile | null;
  job: Job;
};

type Props = {
  fullResume: FullResume;
};

export function MainContent({ fullResume }: Props) {
  return (
    <div className="px-8 pb-28">
      {fullResume.workEntries
        .filter((workEntry) => workEntry.enabled)
        .map((workEntry) => (
          <div key={workEntry.id}>
            <table className="my-12 table-auto border border-collapse border-gray-300">
              <tbody className="text-left">
                <tr>
                  <TableHeaderCell>Company</TableHeaderCell>
                  <TableDataCell>{workEntry.companyName}</TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Location</TableHeaderCell>
                  <TableDataCell>{workEntry.companyLocation}</TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableDataCell>{workEntry.title}</TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableDataCell>{t.jobType[workEntry.type]}</TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Arrangement</TableHeaderCell>
                  <TableDataCell>
                    {t.jobArrangement[workEntry.arrangement]}
                  </TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Start Date</TableHeaderCell>
                  <TableDataCell>{workEntry.startDate}</TableDataCell>
                  <TableDataCell>
                    {toAlternateDateFormat(workEntry.startDate)}
                  </TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>End Date</TableHeaderCell>
                  <TableDataCell>{workEntry.endDate}</TableDataCell>
                  <TableDataCell>
                    {workEntry.endDate &&
                      toAlternateDateFormat(workEntry.endDate)}
                  </TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Description</TableHeaderCell>
                  <TableDataCell>
                    <textarea
                      className="w-full"
                      readOnly
                      value={workEntry.bullets
                        .filter((bullet) => bullet.enabled)
                        .map((bullet) => `- ${bullet.text}`)
                        .join("\n")}
                    ></textarea>
                  </TableDataCell>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      {fullResume.educationEntries
        .filter((educationEntry) => educationEntry.enabled)
        .map((educationEntry) => (
          <div key={educationEntry.id}>
            <table className="my-12 table-auto border border-collapse border-gray-300">
              <tbody className="text-left">
                <tr>
                  <TableHeaderCell>School</TableHeaderCell>
                  <TableDataCell>{educationEntry.schoolName}</TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Location</TableHeaderCell>
                  <TableDataCell>{educationEntry.schoolLocation}</TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableDataCell>{educationEntry.title}</TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Graduation Date</TableHeaderCell>
                  <TableDataCell>{educationEntry.graduationDate}</TableDataCell>
                  <TableDataCell>
                    {toAlternateDateFormat(educationEntry.graduationDate)}
                  </TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Description</TableHeaderCell>
                  <TableDataCell>
                    <textarea
                      className="w-full"
                      readOnly
                      value={educationEntry.bullets
                        .filter((bullet) => bullet.enabled)
                        .map((bullet) => `- ${bullet.text}`)
                        .join("\n")}
                    ></textarea>
                  </TableDataCell>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      {fullResume.certifications
        .filter((certification) => certification.enabled)
        .map((certification) => (
          <div key={certification.id}>
            <table className="my-12 table-auto border border-collapse border-gray-300">
              <tbody className="text-left">
                <tr>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableDataCell>{certification.title}</TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Issuer</TableHeaderCell>
                  <TableDataCell>{certification.issuer}</TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Issue Date</TableHeaderCell>
                  <TableDataCell>{certification.issueDate}</TableDataCell>
                  <TableDataCell>
                    {toAlternateDateFormat(certification.issueDate)}
                  </TableDataCell>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      {fullResume.skillCategories
        .filter((skillCategory) => skillCategory.enabled)
        .map((skillCategory) => (
          <div key={skillCategory.id}>
            <table className="my-12 table-auto border border-collapse border-gray-300">
              <tbody className="text-left">
                <tr>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableDataCell>{skillCategory.name}</TableDataCell>
                </tr>
                <tr>
                  <TableHeaderCell>Skills</TableHeaderCell>
                  {skillCategory.skills
                    .filter((skill) => skill.enabled)
                    .map((skill) => (
                      <TableDataCell key={skill.id}>{skill.text}</TableDataCell>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}

type TableCellProps = {
  children?: ReactNode;
  className?: string;
};

function TableHeaderCell({ children, className }: TableCellProps) {
  return (
    <th className={`border border-gray-300 px-4 py-1 ${className ?? ""}`}>
      {children}
    </th>
  );
}

function TableDataCell({ children, className }: TableCellProps) {
  const handleClick = (e: MouseEvent<HTMLTableCellElement>) => {
    navigator.clipboard.writeText(e.currentTarget.textContent ?? "");
  };

  return (
    <td
      className={`cursor-pointer border border-gray-300 px-4 py-1 ${
        className ?? ""
      }`}
      onClick={handleClick}
    >
      {children}
    </td>
  );
}

function toAlternateDateFormat(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${month}${day}${year}`;
}
