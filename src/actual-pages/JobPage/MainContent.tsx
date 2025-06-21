import {
  ApplicationQuestion,
  Contact,
  Job,
  Link,
  Profile,
  Resume,
} from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { JobEditor } from "./JobEditor";
import { ApplicationQuestionEditor } from "./ApplicationQuestionEditor";
import { ContactEditor } from "./ContactEditor";
import { LinkEditor } from "./LinkEditor";
import { SectionHeading } from "@/components/SectionHeading";
import { ResumeOverview } from "./ResumeOverview";
import { t } from "@/translate";
import { KeyedMutator } from "swr";

type FullJob = Job & {
  resumes: Resume[];
  links: Link[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

type Props = {
  fullJob: FullJob;
  mutateFullJob: KeyedMutator<FullJob>;
  profiles: Profile[];
};

export function MainContent({ fullJob, mutateFullJob, profiles }: Props) {
  const [profilePid, setProfilePid] = useState<string>(profiles[0]?.pid ?? "");

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

  const createLink = async () => {
    const response = await fetch(`/api/jobs/${fullJob.pid}/links`, {
      method: "POST",
    });
    const link: Link = await response.json();
    mutateFullJob(
      {
        ...fullJob,
        links: [...fullJob.links, link],
      },
      { revalidate: false }
    );
  };

  const updateLink = async (link: Link) => {
    mutateFullJob(
      {
        ...fullJob,
        links: fullJob.links.map((l) => {
          if (l.id === link.id) {
            return link;
          } else {
            return l;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/links/${link.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(link),
    });
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const deleteLink = async (link: Link) => {
    mutateFullJob(
      {
        ...fullJob,
        links: fullJob.links.filter((l) => l.id !== link.id),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/links/${link.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const moveLinkUp = async (link: Link) => {
    const links = [...fullJob.links];
    const index = links.findIndex((item) => item.id === link.id);
    if (index > 0) {
      const swapIndex = index - 1;
      [links[index], links[swapIndex]] = [links[swapIndex], links[index]];
    } else {
      links.push(links.shift()!);
    }
    mutateFullJob({ ...fullJob, links }, { revalidate: false });
    const orderedPids = links.map((item) => item.pid);
    const response = await fetch(`/api/jobs/${fullJob.pid}/links/order`, {
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

  const moveLinkDown = async (link: Link) => {
    const links = [...fullJob.links];
    const index = links.findIndex((item) => item.id === link.id);
    if (index < links.length - 1) {
      const swapIndex = index + 1;
      [links[index], links[swapIndex]] = [links[swapIndex], links[index]];
    } else {
      links.unshift(links.pop()!);
    }
    mutateFullJob({ ...fullJob, links }, { revalidate: false });
    const orderedPids = links.map((item) => item.pid);
    const response = await fetch(`/api/jobs/${fullJob.pid}/links/order`, {
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

  const createApplicationQuestion = async () => {
    const response = await fetch(
      `/api/jobs/${fullJob.pid}/applicationQuestions`,
      {
        method: "POST",
      }
    );
    const applicationQuestion: ApplicationQuestion = await response.json();
    mutateFullJob(
      {
        ...fullJob,
        applicationQuestions: [
          ...fullJob.applicationQuestions,
          applicationQuestion,
        ],
      },
      { revalidate: false }
    );
  };

  const updateApplicationQuestion = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    mutateFullJob(
      {
        ...fullJob,
        applicationQuestions: fullJob.applicationQuestions.map((a) => {
          if (a.id === applicationQuestion.id) {
            return applicationQuestion;
          } else {
            return a;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/applicationQuestions/${applicationQuestion.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationQuestion),
      }
    );
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const deleteApplicationQuestion = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    mutateFullJob(
      {
        ...fullJob,
        applicationQuestions: fullJob.applicationQuestions.filter(
          (q) => q.id !== applicationQuestion.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/applicationQuestions/${applicationQuestion.pid}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const moveApplicationQuestionUp = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    const applicationQuestions = [...fullJob.applicationQuestions];
    const index = applicationQuestions.findIndex(
      (item) => item.id === applicationQuestion.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [applicationQuestions[index], applicationQuestions[swapIndex]] = [
        applicationQuestions[swapIndex],
        applicationQuestions[index],
      ];
    } else {
      applicationQuestions.push(applicationQuestions.shift()!);
    }
    mutateFullJob({ ...fullJob, applicationQuestions }, { revalidate: false });
    const orderedPids = applicationQuestions.map((item) => item.pid);
    const response = await fetch(
      `/api/jobs/${fullJob.pid}/applicationQuestions/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const moveApplicationQuestionDown = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    const applicationQuestions = [...fullJob.applicationQuestions];
    const index = applicationQuestions.findIndex(
      (item) => item.id === applicationQuestion.id
    );
    if (index < applicationQuestions.length - 1) {
      const swapIndex = index + 1;
      [applicationQuestions[index], applicationQuestions[swapIndex]] = [
        applicationQuestions[swapIndex],
        applicationQuestions[index],
      ];
    } else {
      applicationQuestions.unshift(applicationQuestions.pop()!);
    }
    mutateFullJob({ ...fullJob, applicationQuestions }, { revalidate: false });
    const orderedPids = applicationQuestions.map((item) => item.pid);
    const response = await fetch(
      `/api/jobs/${fullJob.pid}/applicationQuestions/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
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
