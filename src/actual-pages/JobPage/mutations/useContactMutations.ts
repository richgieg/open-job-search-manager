import { Contact } from "@/generated/prisma";
import { useFullJobContext } from "../FullJobContext";

export function useContactMutations() {
  const { fullJob, mutateFullJob } = useFullJobContext();

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

  return {
    createContact,
    duplicateContact,
    updateContact,
    deleteContact,
    moveContactUp,
    moveContactDown,
  };
}
