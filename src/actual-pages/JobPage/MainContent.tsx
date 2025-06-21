import { Profile } from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { SectionHeading } from "@/components";
import { t } from "@/translate";
import { useFullJobContext } from "./FullJobContext";
import {
  ApplicationQuestionEditor,
  ContactEditor,
  JobEditor,
  LinkEditor,
  ResumeEditor,
} from "./editors";
import {
  useApplicationQuestionMutations,
  useContactMutations,
  useLinkMutations,
  useResumeMutations,
} from "./mutations";

type Props = {
  profiles: Profile[];
};

export function MainContent({ profiles }: Props) {
  const [profilePid, setProfilePid] = useState<string>(profiles[0]?.pid ?? "");
  const { fullJob } = useFullJobContext();
  const { createResume } = useResumeMutations();
  const { createLink } = useLinkMutations();
  const { createApplicationQuestion } = useApplicationQuestionMutations();
  const { createContact } = useContactMutations();

  const handleCreateResume = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createResume(profilePid);
  };

  return (
    <div className="px-8 pb-28">
      <SectionHeading text="Job Details" />
      <JobEditor job={fullJob} />
      <SectionHeading text="Resumes" />
      <div className="mt-6 flex flex-col gap-6">
        {fullJob.resumes.length > 0 && (
          <div className="flex flex-col gap-4">
            {fullJob.resumes.map((r) => (
              <ResumeEditor key={r.id} resume={r} />
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
              <LinkEditor key={l.id} link={l} />
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
              <ApplicationQuestionEditor key={q.id} applicationQuestion={q} />
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
              <ContactEditor key={c.id} contact={c} />
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
