import { DeleteButton } from "@/components/DeleteButton";
import { DuplicateButton } from "@/components/DuplicateButton";
import { Resume } from "@/generated/prisma";
import { t } from "@/translate";
import Link from "next/link";

type Props = {
  resume: Resume;
  deleteResume: (resume: Resume) => Promise<void>;
  duplicateResume: (resume: Resume) => Promise<void>;
};

export function ResumeOverview({
  resume,
  deleteResume,
  duplicateResume,
}: Props) {
  return (
    <div className="flex gap-2">
      <Link href={`/resumes/${resume.pid}`}>
        {resume.resumeName || t.resumeNamePlaceholder}
      </Link>
      <DuplicateButton
        className="w-12"
        onClick={() => duplicateResume(resume)}
      />
      <DeleteButton className="w-12" onClick={() => deleteResume(resume)} />
    </div>
  );
}
