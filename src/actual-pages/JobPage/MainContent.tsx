import { Profile, Resume } from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { JobEditor } from "./JobEditor";
import { ApplicationQuestionEditor } from "./ApplicationQuestionEditor";
import { ContactEditor } from "./ContactEditor";
import { LinkEditor } from "./LinkEditor";
import { SectionHeading } from "@/components/SectionHeading";
import { ResumeOverview } from "./ResumeOverview";
import { t } from "@/translate";
import { useFullJobContext } from "./FullJobContext";
import { useLinkMutations } from "./useLinkMutations";
import { useApplicationQuestionMutations } from "./useApplicationQuestionMutations";
import { useContactMutations } from "./useContactMutations";
import { useJobMutations } from "./useJobMutations";

type Props = {
  profiles: Profile[];
};

export function MainContent({ profiles }: Props) {
  const { fullJob, mutateFullJob } = useFullJobContext();
  const [profilePid, setProfilePid] = useState<string>(profiles[0]?.pid ?? "");

  const { updateJob } = useJobMutations();
  const { createLink, updateLink, deleteLink, moveLinkUp, moveLinkDown } =
    useLinkMutations();
  const {
    createApplicationQuestion,
    updateApplicationQuestion,
    deleteApplicationQuestion,
    moveApplicationQuestionUp,
    moveApplicationQuestionDown,
  } = useApplicationQuestionMutations();
  const {
    createContact,
    duplicateContact,
    updateContact,
    deleteContact,
    moveContactUp,
    moveContactDown,
  } = useContactMutations();

  const handleCreateResume = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createResume(profilePid);
  };

  const createResume = async (profilePid: string) => {
    const response = await fetch("/api/resumes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobPid: fullJob.pid,
        profilePid,
      }),
    });
    const resume: Resume = await response.json();
    mutateFullJob(
      {
        ...fullJob,
        resumes: [...fullJob.resumes, resume],
      },
      { revalidate: false }
    );
  };

  const duplicateResume = async (resume: Resume) => {
    const response = await fetch(`/api/resumes/${resume.pid}/duplicate`, {
      method: "POST",
    });
    const duplicatedResume: Resume = await response.json();
    mutateFullJob(
      {
        ...fullJob,
        resumes: [...fullJob.resumes, duplicatedResume],
      },
      { revalidate: false }
    );
  };

  const deleteResume = async (resume: Resume) => {
    // TODO: Show confirmation modal.
    mutateFullJob(
      {
        ...fullJob,
        resumes: fullJob.resumes.filter((r) => r.id !== resume.id),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/resumes/${resume.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  return (
    <div className="px-8 pb-28">
      <SectionHeading text="Job Details" />
      <JobEditor job={fullJob} updateJob={updateJob} />
      <SectionHeading text="Resumes" />
      <div className="mt-6 flex flex-col gap-6">
        {fullJob.resumes.length > 0 && (
          <div className="flex flex-col gap-4">
            {fullJob.resumes.map((r) => (
              <ResumeOverview
                key={r.id}
                resume={r}
                deleteResume={deleteResume}
                duplicateResume={duplicateResume}
              />
            ))}
          </div>
        )}
        <form onSubmit={handleCreateResume}>
          <label>
            Profile:
            <select
              value={profilePid}
              onChange={(e) => setProfilePid(e.target.value)}
              disabled={profiles.length === 0}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.profileName || t.profileNamePlaceholder}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={profiles.length === 0}>
            New Resume
          </button>
        </form>
      </div>
      <SectionHeading text="Links" />
      <div className="mt-6 flex flex-col gap-6">
        {fullJob.links.length > 0 && (
          <div className="flex flex-col gap-4">
            {fullJob.links.map((l) => (
              <LinkEditor
                key={l.id}
                link={l}
                updateLink={updateLink}
                deleteLink={deleteLink}
                moveLinkUp={moveLinkUp}
                moveLinkDown={moveLinkDown}
              />
            ))}
          </div>
        )}
        <div>
          <button onClick={createLink}>New Link</button>
        </div>
      </div>
      <SectionHeading text="Application Questions" />
      <div className="mt-6 flex flex-col gap-6">
        {fullJob.applicationQuestions.length > 0 && (
          <div className="flex flex-col gap-4">
            {fullJob.applicationQuestions.map((q) => (
              <ApplicationQuestionEditor
                key={q.id}
                applicationQuestion={q}
                updateApplicationQuestion={updateApplicationQuestion}
                deleteApplicationQuestion={deleteApplicationQuestion}
                moveApplicationQuestionUp={moveApplicationQuestionUp}
                moveApplicationQuestionDown={moveApplicationQuestionDown}
              />
            ))}
          </div>
        )}
        <div>
          <button onClick={createApplicationQuestion}>New Question</button>
        </div>
      </div>
      <SectionHeading text="Contacts" />
      <div className="mt-6 flex flex-col gap-6">
        {fullJob.contacts.length > 0 && (
          <div className="flex flex-col gap-4">
            {fullJob.contacts.map((c) => (
              <ContactEditor
                key={c.id}
                contact={c}
                updateContact={updateContact}
                deleteContact={deleteContact}
                duplicateContact={duplicateContact}
                moveContactUp={moveContactUp}
                moveContactDown={moveContactDown}
              />
            ))}
          </div>
        )}
        <div>
          <button onClick={createContact}>New Contact</button>
        </div>
      </div>
    </div>
  );
}
