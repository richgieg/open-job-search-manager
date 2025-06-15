import { DeleteButton } from "@/components/DeleteButton";
import { MoveDownButton } from "@/components/MoveDownButton";
import { MoveUpButton } from "@/components/MoveUpButton";
import { SaveButton } from "@/components/SaveButton";
import { TextEditor } from "@/components/TextEditor";
import { Link } from "@/generated/prisma";
import { FormEvent, useState } from "react";

type Props = {
  link: Link;
  updateLink: (link: Link) => Promise<void>;
  deleteLink: (link: Link) => Promise<void>;
  moveLinkUp: (link: Link) => Promise<void>;
  moveLinkDown: (link: Link) => Promise<void>;
};

export function LinkEditor({
  link,
  updateLink,
  deleteLink,
  moveLinkUp,
  moveLinkDown,
}: Props) {
  const [name, setName] = useState(link.name);
  const [url, setUrl] = useState(link.url);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateLink({
      id: link.id,
      pid: link.pid,
      jobId: link.jobId,
      sortOrder: link.sortOrder,
      name,
      url,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <TextEditor
        label="Name"
        value={name}
        setValue={setName}
        originalValue={link.name}
      />
      <TextEditor
        label="URL"
        value={url}
        setValue={setUrl}
        originalValue={link.url}
      />
      <MoveUpButton className="w-12" onClick={() => moveLinkUp(link)} />
      <MoveDownButton className="w-12" onClick={() => moveLinkDown(link)} />
      <SaveButton
        className="w-12"
        hasUnsavedChanges={name !== link.name || url !== link.url}
      />
      <DeleteButton className="w-12" onClick={() => deleteLink(link)} />
    </form>
  );
}
