import { DateEditor } from "@/components/DateEditor";
import { DeleteButton } from "@/components/DeleteButton";
import { MoveDownButton } from "@/components/MoveDownButton";
import { MoveUpButton } from "@/components/MoveUpButton";
import { SaveButton } from "@/components/SaveButton";
import { TextEditor } from "@/components/TextEditor";
import { EducationEntry } from "@/generated/prisma";
import { FormEvent, useState } from "react";

type Props = {
  educationEntry: EducationEntry;
  updateEducationEntry: (educationEntry: EducationEntry) => Promise<void>;
  deleteEducationEntry: (educationEntry: EducationEntry) => Promise<void>;
  moveEducationEntryUp: (educationEntry: EducationEntry) => Promise<void>;
  moveEducationEntryDown: (educationEntry: EducationEntry) => Promise<void>;
};

export function EducationEntryEditor({
  educationEntry,
  updateEducationEntry,
  deleteEducationEntry,
  moveEducationEntryUp,
  moveEducationEntryDown,
}: Props) {
  const [schoolName, setSchoolName] = useState(educationEntry.schoolName);
  const [schoolLocation, setSchoolLocation] = useState(
    educationEntry.schoolLocation
  );
  const [title, setTitle] = useState(educationEntry.title);
  const [graduationDate, setGraduationDate] = useState(
    educationEntry.graduationDate
  );

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
