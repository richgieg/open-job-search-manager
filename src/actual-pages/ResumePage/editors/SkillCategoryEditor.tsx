import {
  DeleteButton,
  MoveDownButton,
  MoveUpButton,
  SaveButton,
  TextEditor,
} from "@/components";
import { ResumeSkillCategory } from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { useSkillCategoryMutations } from "../mutations";

type Props = {
  skillCategory: ResumeSkillCategory;
};

export function SkillCategoryEditor({ skillCategory }: Props) {
  const [name, setName] = useState(skillCategory.name);
  const {
    updateSkillCategory,
    deleteSkillCategory,
    moveSkillCategoryUp,
    moveSkillCategoryDown,
  } = useSkillCategoryMutations();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateSkillCategory({
      id: skillCategory.id,
      pid: skillCategory.pid,
      resumeId: skillCategory.resumeId,
      name,
      enabled: skillCategory.enabled,
      sortOrder: skillCategory.sortOrder,
    });
  };

  const toggleEnabled = async () => {
    await updateSkillCategory({
      id: skillCategory.id,
      pid: skillCategory.pid,
      resumeId: skillCategory.resumeId,
      name: skillCategory.name,
      enabled: !skillCategory.enabled,
      sortOrder: skillCategory.sortOrder,
    });
  };

  const handleDelete = async () => {
    await deleteSkillCategory(skillCategory);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-wrap gap-2 ${
        !skillCategory.enabled && "bg-gray-400"
      }`}
    >
      <input
        className="block w-9"
        type="checkbox"
        checked={skillCategory.enabled}
        onChange={toggleEnabled}
      />
      <TextEditor
        label="Skill Category Name"
        value={name}
        setValue={setName}
        originalValue={skillCategory.name}
      />
      <MoveUpButton
        className="w-12"
        onClick={() => moveSkillCategoryUp(skillCategory)}
      />
      <MoveDownButton
        className="w-12"
        onClick={() => moveSkillCategoryDown(skillCategory)}
      />
      <SaveButton
        className="w-12"
        hasUnsavedChanges={name !== skillCategory.name}
      />
      <DeleteButton className="w-12" onClick={handleDelete} />
    </form>
  );
}
