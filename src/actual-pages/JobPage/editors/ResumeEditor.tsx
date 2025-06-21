import { Resume } from "@/generated/prisma";
import { t } from "@/translate";
import Link from "next/link";
import { useResumeMutations } from "../mutations";
import { DeleteButton, DuplicateButton } from "@/components";

type Props = {
  resume: Resume;
};

export function ResumeEditor({ resume }: Props) {
  const { duplicateResume, deleteResume } = useResumeMutations();

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
