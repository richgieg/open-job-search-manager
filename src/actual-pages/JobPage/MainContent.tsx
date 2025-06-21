import { Contact, Job, Profile, Resume } from "@/generated/prisma";
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

type Props = {
  profiles: Profile[];
};

export function MainContent({ profiles }: Props) {
  const { fullJob, mutateFullJob } = useFullJobContext();
  const [profilePid, setProfilePid] = useState<string>(profiles[0]?.pid ?? "");

  const { createLink, updateLink, deleteLink, moveLinkUp, moveLinkDown } =
    useLinkMutations();
  const {
    createApplicationQuestion,
    updateApplicationQuestion,
    deleteApplicationQuestion,
    moveApplicationQuestionUp,
    moveApplicationQuestionDown,
  } = useApplicationQuestionMutations();

  const updateJob = async (job: Job) => {
    mutateFullJob({ ...fullJob, ...job }, { revalidate: false });
    const response = await fetch(`/api/jobs/${job.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const createResume = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  const createContact = async () => {
    const response = await fetch(`/api/jobs/${fullJob.pid}/contacts`, {
      method: "POST",
    });
    const contact: Contact = await response.json();
    mutateFullJob(
      {
        ...fullJob,
        contacts: [...fullJob.contacts, contact],
      },
      { revalidate: false }
    );
  };

  const duplicateContact = async (contact: Contact) => {
    const response = await fetch(`/api/contacts/${contact.pid}/duplicate`, {
      method: "POST",
    });
    const duplicatedContact: Contact = await response.json();
    mutateFullJob(
      {
        ...fullJob,
        contacts: [...fullJob.contacts, duplicatedContact],
      },
      { revalidate: false }
    );
  };

  const updateContact = async (contact: Contact) => {
    mutateFullJob(
      {
        ...fullJob,
        contacts: fullJob.contacts.map((c) => {
          if (c.id === contact.id) {
            return contact;
          } else {
            return c;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/contacts/${contact.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const deleteContact = async (contact: Contact) => {
    mutateFullJob(
      {
        ...fullJob,
        contacts: fullJob.contacts.filter((c) => c.id !== contact.id),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/contacts/${contact.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const moveContactUp = async (contact: Contact) => {
    const contacts = [...fullJob.contacts];
    const index = contacts.findIndex((item) => item.id === contact.id);
    if (index > 0) {
      const swapIndex = index - 1;
      [contacts[index], contacts[swapIndex]] = [
        contacts[swapIndex],
        contacts[index],
      ];
    } else {
      contacts.push(contacts.shift()!);
    }
    mutateFullJob({ ...fullJob, contacts }, { revalidate: false });
    const orderedPids = contacts.map((item) => item.pid);
    const response = await fetch(`/api/jobs/${fullJob.pid}/contacts/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const moveContactDown = async (contact: Contact) => {
    const contacts = [...fullJob.contacts];
    const index = contacts.findIndex((item) => item.id === contact.id);
    if (index < contacts.length - 1) {
      const swapIndex = index + 1;
      [contacts[index], contacts[swapIndex]] = [
        contacts[swapIndex],
        contacts[index],
      ];
    } else {
      contacts.unshift(contacts.pop()!);
    }
    mutateFullJob({ ...fullJob, contacts }, { revalidate: false });
    const orderedPids = contacts.map((item) => item.pid);
    const response = await fetch(`/api/jobs/${fullJob.pid}/contacts/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
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
        <form onSubmit={createResume}>
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
