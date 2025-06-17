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
  setFullJob: (fullJob: FullJob) => void;
  profiles: Profile[];
};

export function MainContent({ fullJob, setFullJob, profiles }: Props) {
  const [profilePid, setProfilePid] = useState<string>(profiles[0]?.pid ?? "");

  const updateJob = async (job: Job) => {
    const response = await fetch(`/api/jobs/${job.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
    const updatedJob: Job = await response.json();
    setFullJob({
      ...fullJob,
      ...updatedJob,
    });
  };

  const createResume = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/resumes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId: fullJob.id,
        profileId: profilePid,
      }),
    });
    const resume: Resume = await response.json();
    setFullJob({
      ...fullJob,
      resumes: [...fullJob.resumes, resume],
    });
  };

  const duplicateResume = async (resume: Resume) => {
    const response = await fetch(`/api/resumes/${resume.id}/duplicate`, {
      method: "POST",
    });
    const duplicatedResume: Resume = await response.json();
    setFullJob({
      ...fullJob,
      resumes: [...fullJob.resumes, duplicatedResume],
    });
  };

  const deleteResume = async (resume: Resume) => {
    if (
      !confirm(
        `"${
          resume.resumeName || t.resumeNamePlaceholder
        }" will be deleted. Continue?`
      )
    )
      return;
    const response = await fetch(`/api/resumes/${resume.id}`, {
      method: "DELETE",
    });
    const deletedResume: Resume = await response.json();
    setFullJob({
      ...fullJob,
      resumes: fullJob.resumes.filter(
        (resume) => resume.id !== deletedResume.id
      ),
    });
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
    const response = await fetch(`/api/links/${link.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(link),
    });
    const updatedLink: Link = await response.json();
    setFullJob({
      ...fullJob,
      links: fullJob.links.map((link) => {
        if (link.id === updatedLink.id) {
          return updatedLink;
        } else {
          return link;
        }
      }),
    });
  };

  const deleteLink = async (link: Link) => {
    await fetch(`/api/links/${link.pid}`, {
      method: "DELETE",
    });
    setFullJob({
      ...fullJob,
      links: fullJob.links.filter((l) => l.id !== link.id),
    });
  };

  const moveLinkUp = async (link: Link) => {
    const index = fullJob.links.findIndex((item) => item.id === link.id);
    if (index > 0) {
      const swapIndex = index - 1;
      [fullJob.links[index], fullJob.links[swapIndex]] = [
        fullJob.links[swapIndex],
        fullJob.links[index],
      ];
    } else {
      fullJob.links.push(fullJob.links.shift()!);
    }
    const orderedIds = fullJob.links.map((item) => item.id);
    await fetch(`/api/jobs/${fullJob.id}/links/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullJob({
      ...fullJob,
    });
  };

  const moveLinkDown = async (link: Link) => {
    const index = fullJob.links.findIndex((item) => item.id === link.id);
    if (index < fullJob.links.length - 1) {
      const swapIndex = index + 1;
      [fullJob.links[index], fullJob.links[swapIndex]] = [
        fullJob.links[swapIndex],
        fullJob.links[index],
      ];
    } else {
      fullJob.links.unshift(fullJob.links.pop()!);
    }
    const orderedIds = fullJob.links.map((item) => item.id);
    await fetch(`/api/jobs/${fullJob.id}/links/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullJob({
      ...fullJob,
    });
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
    const updatedApplicationQuestion: ApplicationQuestion =
      await response.json();
    setFullJob({
      ...fullJob,
      applicationQuestions: fullJob.applicationQuestions.map(
        (applicationQuestion) => {
          if (applicationQuestion.id === updatedApplicationQuestion.id) {
            return updatedApplicationQuestion;
          } else {
            return applicationQuestion;
          }
        }
      ),
    });
  };

  const deleteApplicationQuestion = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    await fetch(`/api/applicationQuestions/${applicationQuestion.pid}`, {
      method: "DELETE",
    });
    setFullJob({
      ...fullJob,
      applicationQuestions: fullJob.applicationQuestions.filter(
        (q) => q.id !== applicationQuestion.id
      ),
    });
  };

  const moveApplicationQuestionUp = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    const index = fullJob.applicationQuestions.findIndex(
      (item) => item.id === applicationQuestion.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [
        fullJob.applicationQuestions[index],
        fullJob.applicationQuestions[swapIndex],
      ] = [
        fullJob.applicationQuestions[swapIndex],
        fullJob.applicationQuestions[index],
      ];
    } else {
      fullJob.applicationQuestions.push(fullJob.applicationQuestions.shift()!);
    }
    const orderedIds = fullJob.applicationQuestions.map((item) => item.id);
    await fetch(`/api/jobs/${fullJob.id}/applicationQuestions/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullJob({
      ...fullJob,
    });
  };

  const moveApplicationQuestionDown = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    const index = fullJob.applicationQuestions.findIndex(
      (item) => item.id === applicationQuestion.id
    );
    if (index < fullJob.applicationQuestions.length - 1) {
      const swapIndex = index + 1;
      [
        fullJob.applicationQuestions[index],
        fullJob.applicationQuestions[swapIndex],
      ] = [
        fullJob.applicationQuestions[swapIndex],
        fullJob.applicationQuestions[index],
      ];
    } else {
      fullJob.applicationQuestions.unshift(fullJob.applicationQuestions.pop()!);
    }
    const orderedIds = fullJob.applicationQuestions.map((item) => item.id);
    await fetch(`/api/jobs/${fullJob.id}/applicationQuestions/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullJob({
      ...fullJob,
    });
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
    const response = await fetch(`/api/contacts/${contact.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    const updatedContact: Contact = await response.json();
    setFullJob({
      ...fullJob,
      contacts: fullJob.contacts.map((contact) => {
        if (contact.id === updatedContact.id) {
          return updatedContact;
        } else {
          return contact;
        }
      }),
    });
  };

  const deleteContact = async (contact: Contact) => {
    await fetch(`/api/contacts/${contact.pid}`, {
      method: "DELETE",
    });
    setFullJob({
      ...fullJob,
      contacts: fullJob.contacts.filter((c) => c.id !== contact.id),
    });
  };

  const moveContactUp = async (contact: Contact) => {
    const index = fullJob.contacts.findIndex((item) => item.id === contact.id);
    if (index > 0) {
      const swapIndex = index - 1;
      [fullJob.contacts[index], fullJob.contacts[swapIndex]] = [
        fullJob.contacts[swapIndex],
        fullJob.contacts[index],
      ];
    } else {
      fullJob.contacts.push(fullJob.contacts.shift()!);
    }
    const orderedIds = fullJob.contacts.map((item) => item.id);
    await fetch(`/api/jobs/${fullJob.id}/contacts/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullJob({
      ...fullJob,
    });
  };

  const moveContactDown = async (contact: Contact) => {
    const index = fullJob.contacts.findIndex((item) => item.id === contact.id);
    if (index < fullJob.contacts.length - 1) {
      const swapIndex = index + 1;
      [fullJob.contacts[index], fullJob.contacts[swapIndex]] = [
        fullJob.contacts[swapIndex],
        fullJob.contacts[index],
      ];
    } else {
      fullJob.contacts.unshift(fullJob.contacts.pop()!);
    }
    const orderedIds = fullJob.contacts.map((item) => item.id);
    await fetch(`/api/jobs/${fullJob.id}/contacts/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedIds }),
    });
    setFullJob({
      ...fullJob,
    });
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
                  {p.profileName}
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
