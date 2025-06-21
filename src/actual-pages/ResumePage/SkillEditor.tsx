import {
  DeleteButton,
  MoveDownButton,
  MoveUpButton,
  SaveButton,
  TextEditor,
} from "@/components";
import { ResumeSkill } from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { useSkillMutations } from "./mutations";

type Props = {
  skill: ResumeSkill;
  skillCategoryEnabled: boolean;
};

export function SkillEditor({ skill, skillCategoryEnabled }: Props) {
  const [text, setText] = useState(skill.text);
  const { updateSkill, deleteSkill, moveSkillUp, moveSkillDown } =
    useSkillMutations();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateSkill({
      id: skill.id,
      pid: skill.pid,
      skillCategoryId: skill.skillCategoryId,
      text,
      enabled: skill.enabled,
      sortOrder: skill.sortOrder,
    });
  };

  const toggleEnabled = async () => {
    await updateSkill({
      id: skill.id,
      pid: skill.pid,
      skillCategoryId: skill.skillCategoryId,
      text: skill.text,
      enabled: !skill.enabled,
      sortOrder: skill.sortOrder,
    });
  };

  const handleDelete = async () => {
    await deleteSkill(skill);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex gap-2 ${
        (!skill.enabled || !skillCategoryEnabled) && "bg-gray-400"
      }`}
    >
      <input
        className="block w-9"
        type="checkbox"
        checked={skill.enabled}
        onChange={toggleEnabled}
      />
      <TextEditor value={text} setValue={setText} originalValue={skill.text} />
      <MoveUpButton className="w-8" onClick={() => moveSkillUp(skill)} />
      <MoveDownButton className="w-8" onClick={() => moveSkillDown(skill)} />
      <SaveButton className="w-8" hasUnsavedChanges={text !== skill.text} />
      <DeleteButton className="w-8" onClick={handleDelete} />
    </form>
  );
}
