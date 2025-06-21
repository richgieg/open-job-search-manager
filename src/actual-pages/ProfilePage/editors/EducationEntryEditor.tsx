import { EducationEntry } from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { useEducationEntryMutations } from "../mutations";
import {
  DateEditor,
  DeleteButton,
  MoveDownButton,
  MoveUpButton,
  SaveButton,
  TextEditor,
} from "@/components";

type Props = {
  educationEntry: EducationEntry;
};

export function EducationEntryEditor({ educationEntry }: Props) {
  const [schoolName, setSchoolName] = useState(educationEntry.schoolName);
  const [schoolLocation, setSchoolLocation] = useState(
    educationEntry.schoolLocation
  );
  const [title, setTitle] = useState(educationEntry.title);
  const [graduationDate, setGraduationDate] = useState(
    educationEntry.graduationDate
  );
  const {
    updateEducationEntry,
    deleteEducationEntry,
    moveEducationEntryUp,
    moveEducationEntryDown,
  } = useEducationEntryMutations();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateEducationEntry({
      id: educationEntry.id,
      pid: educationEntry.pid,
      profileId: educationEntry.profileId,
      schoolName,
      schoolLocation,
      title,
      graduationDate,
      enabled: educationEntry.enabled,
      sortOrder: educationEntry.sortOrder,
    });
  };

  const toggleEnabled = async () => {
    await updateEducationEntry({
      id: educationEntry.id,
      pid: educationEntry.pid,
      profileId: educationEntry.profileId,
      schoolName: educationEntry.schoolName,
      schoolLocation: educationEntry.schoolLocation,
      title: educationEntry.title,
      graduationDate: educationEntry.graduationDate,
      enabled: !educationEntry.enabled,
      sortOrder: educationEntry.sortOrder,
    });
  };

  const handleDelete = async () => {
    await deleteEducationEntry(educationEntry);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-wrap gap-2 ${
        !educationEntry.enabled && "bg-gray-400"
      }`}
    >
      <input
        className="block w-9"
        type="checkbox"
        checked={educationEntry.enabled}
        onChange={toggleEnabled}
      />
      <TextEditor
        label="School Name"
        value={schoolName}
        setValue={setSchoolName}
        originalValue={educationEntry.schoolName}
      />
      <TextEditor
        label="School Location"
        value={schoolLocation}
        setValue={setSchoolLocation}
        originalValue={educationEntry.schoolLocation}
      />
      <TextEditor
        label="Title"
        value={title}
        setValue={setTitle}
        originalValue={educationEntry.title}
      />
      <DateEditor
        label="Graduation Date"
        value={graduationDate}
        setValue={setGraduationDate}
        originalValue={educationEntry.graduationDate}
        required
      />
      <MoveUpButton
        className="w-12"
        onClick={() => moveEducationEntryUp(educationEntry)}
      />
      <MoveDownButton
        className="w-12"
        onClick={() => moveEducationEntryDown(educationEntry)}
      />
      <SaveButton
        className="w-12"
        hasUnsavedChanges={
          schoolName !== educationEntry.schoolName ||
          schoolLocation !== educationEntry.schoolLocation ||
          title !== educationEntry.title ||
          graduationDate !== educationEntry.graduationDate
        }
      />
      <DeleteButton className="w-12" onClick={handleDelete} />
    </form>
  );
}
