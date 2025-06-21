import { Link } from "@/generated/prisma";
import { useFullJobContext } from "./FullJobContext";

export function useLinkMutations() {
  const { fullJob, mutateFullJob } = useFullJobContext();

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

  return {
    createLink,
    updateLink,
    deleteLink,
    moveLinkUp,
    moveLinkDown,
  };
}
