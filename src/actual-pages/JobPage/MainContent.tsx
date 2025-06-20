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

type FullJob = Job & {
  resumes: Resume[];
  links: Link[];
  contacts: Contact[];
  applicationQuestions: ApplicationQuestion[];
};

type Props = {
  fullJob: FullJob;
  setFullJob: (fullJob: FullJob, revalidate?: boolean) => void;
  profiles: Profile[];
};

export function MainContent({ fullJob, setFullJob, profiles }: Props) {
  const [profilePid, setProfilePid] = useState<string>(profiles[0]?.pid ?? "");

  const updateJob = async (job: Job) => {
    setFullJob({ ...fullJob, ...job });
    const response = await fetch(`/api/jobs/${job.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      setFullJob(fullJob, true);
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
    setFullJob({
      ...fullJob,
      resumes: [...fullJob.resumes, resume],
    });
  };

  const duplicateResume = async (resume: Resume) => {
    const response = await fetch(`/api/resumes/${resume.pid}/duplicate`, {
      method: "POST",
    });
    const duplicatedResume: Resume = await response.json();
    setFullJob({
      ...fullJob,
      resumes: [...fullJob.resumes, duplicatedResume],
    });
  };

  const deleteResume = async (resume: Resume) => {
    // TODO: Show confirmation modal.
    setFullJob({
      ...fullJob,
      resumes: fullJob.resumes.filter((r) => r.id !== resume.id),
    });
    const response = await fetch(`/api/resumes/${resume.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setFullJob(fullJob, true);
    }
  };

  const createLink = async () => {
    const response = await fetch(`/api/jobs/${fullJob.pid}/links`, {
      method: "POST",
    });
    const link: Link = await response.json();
    setFullJob({
      ...fullJob,
      links: [...fullJob.links, link],
    });
  };

  const updateLink = async (link: Link) => {
    setFullJob({
      ...fullJob,
      links: fullJob.links.map((l) => {
        if (l.id === link.id) {
          return link;
        } else {
          return l;
        }
      }),
    });
    const response = await fetch(`/api/links/${link.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(link),
    });
    if (!response.ok) {
      setFullJob(fullJob, true);
    }
  };

  const deleteLink = async (link: Link) => {
    setFullJob({
      ...fullJob,
      links: fullJob.links.filter((l) => l.id !== link.id),
    });
    const response = await fetch(`/api/links/${link.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setFullJob(fullJob, true);
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
    setFullJob({ ...fullJob, links });
    const orderedPids = links.map((item) => item.pid);
    const response = await fetch(`/api/jobs/${fullJob.pid}/links/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    if (!response.ok) {
      setFullJob(fullJob, true);
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
    setFullJob({ ...fullJob, links });
    const orderedPids = links.map((item) => item.pid);
    const response = await fetch(`/api/jobs/${fullJob.pid}/links/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    if (!response.ok) {
      setFullJob(fullJob, true);
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
    setFullJob({
      ...fullJob,
      applicationQuestions: [
        ...fullJob.applicationQuestions,
        applicationQuestion,
      ],
    });
  };

  const updateApplicationQuestion = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    setFullJob({
      ...fullJob,
      applicationQuestions: fullJob.applicationQuestions.map((a) => {
        if (a.id === applicationQuestion.id) {
          return applicationQuestion;
        } else {
          return a;
        }
      }),
    });
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
      setFullJob(fullJob, true);
    }
  };

  const deleteApplicationQuestion = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    setFullJob({
      ...fullJob,
      applicationQuestions: fullJob.applicationQuestions.filter(
        (q) => q.id !== applicationQuestion.id
      ),
    });
    const response = await fetch(
      `/api/applicationQuestions/${applicationQuestion.pid}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      setFullJob(fullJob, true);
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
    setFullJob({ ...fullJob, applicationQuestions });
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
      setFullJob(fullJob, true);
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
    setFullJob({ ...fullJob, applicationQuestions });
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
      setFullJob(fullJob, true);
    }
  };

  const createContact = async () => {
    const response = await fetch(`/api/jobs/${fullJob.pid}/contacts`, {
      method: "POST",
    });
    const contact: Contact = await response.json();
    setFullJob({
      ...fullJob,
      contacts: [...fullJob.contacts, contact],
    });
  };

  const duplicateContact = async (contact: Contact) => {
    const response = await fetch(`/api/contacts/${contact.pid}/duplicate`, {
      method: "POST",
    });
    const duplicatedContact: Contact = await response.json();
    setFullJob({
      ...fullJob,
      contacts: [...fullJob.contacts, duplicatedContact],
    });
  };

  const updateContact = async (contact: Contact) => {
    setFullJob({
      ...fullJob,
      contacts: fullJob.contacts.map((c) => {
        if (c.id === contact.id) {
          return contact;
        } else {
          return c;
        }
      }),
    });
    const response = await fetch(`/api/contacts/${contact.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      setFullJob(fullJob, true);
    }
  };

  const deleteContact = async (contact: Contact) => {
    setFullJob({
      ...fullJob,
      contacts: fullJob.contacts.filter((c) => c.id !== contact.id),
    });
    const response = await fetch(`/api/contacts/${contact.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setFullJob(fullJob, true);
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
    setFullJob({ ...fullJob, contacts });
    const orderedPids = contacts.map((item) => item.pid);
    const response = await fetch(`/api/jobs/${fullJob.pid}/contacts/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    if (!response.ok) {
      setFullJob(fullJob, true);
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
    setFullJob({ ...fullJob, contacts });
    const orderedPids = contacts.map((item) => item.pid);
    const response = await fetch(`/api/jobs/${fullJob.pid}/contacts/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedPids }),
    });
    if (!response.ok) {
      setFullJob(fullJob, true);
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
