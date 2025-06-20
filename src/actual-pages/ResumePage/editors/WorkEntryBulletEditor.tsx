import {
  DeleteButton,
  LongTextEditor,
  MoveDownButton,
  MoveUpButton,
  SaveButton,
} from "@/components";
import { ResumeWorkEntryBullet } from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { useWorkEntryBulletMutations } from "../mutations";

type Props = {
  workEntryBullet: ResumeWorkEntryBullet;
  workEntryEnabled: boolean;
};

export function WorkEntryBulletEditor({
  workEntryBullet,
  workEntryEnabled,
}: Props) {
  const [text, setText] = useState(workEntryBullet.text);
  const {
    updateWorkEntryBullet,
    deleteWorkEntryBullet,
    moveWorkEntryBulletUp,
    moveWorkEntryBulletDown,
  } = useWorkEntryBulletMutations();

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
