import { DeleteButton } from "@/components/DeleteButton";
import { LongTextEditor } from "@/components/LongTextEditor";
import { MoveDownButton } from "@/components/MoveDownButton";
import { MoveUpButton } from "@/components/MoveUpButton";
import { SaveButton } from "@/components/SaveButton";
import { WorkEntryBullet } from "@/generated/prisma";
import { FormEvent, useState } from "react";

type Props = {
  workEntryBullet: WorkEntryBullet;
  workEntryEnabled: boolean;
  updateWorkEntryBullet: (workEntryBullet: WorkEntryBullet) => Promise<void>;
  deleteWorkEntryBullet: (workEntryBullet: WorkEntryBullet) => Promise<void>;
  moveWorkEntryBulletUp: (workEntryBullet: WorkEntryBullet) => Promise<void>;
  moveWorkEntryBulletDown: (workEntryBullet: WorkEntryBullet) => Promise<void>;
};

export function WorkEntryBulletEditor({
  workEntryBullet,
  workEntryEnabled,
  updateWorkEntryBullet,
  deleteWorkEntryBullet,
  moveWorkEntryBulletUp,
  moveWorkEntryBulletDown,
}: Props) {
  const [text, setText] = useState(workEntryBullet.text);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateWorkEntryBullet({
      id: workEntryBullet.id,
      pid: workEntryBullet.pid,
      workEntryId: workEntryBullet.workEntryId,
      text,
      enabled: workEntryBullet.enabled,
      sortOrder: workEntryBullet.sortOrder,
    });
  };

  const toggleEnabled = async () => {
    await updateWorkEntryBullet({
      id: workEntryBullet.id,
      pid: workEntryBullet.pid,
      workEntryId: workEntryBullet.workEntryId,
      text: workEntryBullet.text,
      enabled: !workEntryBullet.enabled,
      sortOrder: workEntryBullet.sortOrder,
    });
  };

  const handleDelete = async () => {
    await deleteWorkEntryBullet(workEntryBullet);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-wrap gap-2 w-5/12 ${
        (!workEntryBullet.enabled || !workEntryEnabled) && "bg-gray-400"
      }`}
    >
      <input
        className="block w-9"
        type="checkbox"
        checked={workEntryBullet.enabled}
        onChange={toggleEnabled}
      />
      <LongTextEditor
        value={text}
        setValue={setText}
        originalValue={workEntryBullet.text}
        className="grow h-28"
      />
      <MoveUpButton
        className="w-12"
        onClick={() => moveWorkEntryBulletUp(workEntryBullet)}
      />
      <MoveDownButton
        className="w-12"
        onClick={() => moveWorkEntryBulletDown(workEntryBullet)}
      />
      <SaveButton
        className="w-12"
        hasUnsavedChanges={text !== workEntryBullet.text}
      />
      <DeleteButton className="w-12" onClick={handleDelete} />
    </form>
  );
}
