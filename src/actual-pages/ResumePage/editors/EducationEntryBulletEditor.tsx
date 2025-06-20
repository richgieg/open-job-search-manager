import {
  DeleteButton,
  LongTextEditor,
  MoveDownButton,
  MoveUpButton,
  SaveButton,
} from "@/components";
import { ResumeEducationEntryBullet } from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { useEducationEntryBulletMutations } from "../mutations";

type Props = {
  educationEntryBullet: ResumeEducationEntryBullet;
  educationEntryEnabled: boolean;
};

export function EducationEntryBulletEditor({
  educationEntryBullet,
  educationEntryEnabled,
}: Props) {
  const [text, setText] = useState(educationEntryBullet.text);
  const {
    updateEducationEntryBullet,
    deleteEducationEntryBullet,
    moveEducationEntryBulletUp,
    moveEducationEntryBulletDown,
  } = useEducationEntryBulletMutations();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateEducationEntryBullet({
      id: educationEntryBullet.id,
      pid: educationEntryBullet.pid,
      educationEntryId: educationEntryBullet.educationEntryId,
      text,
      enabled: educationEntryBullet.enabled,
      sortOrder: educationEntryBullet.sortOrder,
    });
  };

  const toggleEnabled = async () => {
    await updateEducationEntryBullet({
      id: educationEntryBullet.id,
      pid: educationEntryBullet.pid,
      educationEntryId: educationEntryBullet.educationEntryId,
      text: educationEntryBullet.text,
      enabled: !educationEntryBullet.enabled,
      sortOrder: educationEntryBullet.sortOrder,
    });
  };

  const handleDelete = async () => {
    await deleteEducationEntryBullet(educationEntryBullet);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-wrap gap-2 w-5/12 ${
        (!educationEntryBullet.enabled || !educationEntryEnabled) &&
        "bg-gray-400"
      }`}
    >
      <input
        className="block w-9"
        type="checkbox"
        checked={educationEntryBullet.enabled}
        onChange={toggleEnabled}
      />
      <LongTextEditor
        value={text}
        setValue={setText}
        originalValue={educationEntryBullet.text}
        className="grow h-28"
      />
      <MoveUpButton
        className="w-12"
        onClick={() => moveEducationEntryBulletUp(educationEntryBullet)}
      />
      <MoveDownButton
        className="w-12"
        onClick={() => moveEducationEntryBulletDown(educationEntryBullet)}
      />
      <SaveButton
        className="w-12"
        hasUnsavedChanges={text !== educationEntryBullet.text}
      />
      <DeleteButton className="w-12" onClick={handleDelete} />
    </form>
  );
}
