import { DateEditor } from "@/components/DateEditor";
import { DeleteButton } from "@/components/DeleteButton";
import { DropdownEditor } from "@/components/DropdownEditor";
import { MoveDownButton } from "@/components/MoveDownButton";
import { MoveUpButton } from "@/components/MoveUpButton";
import { SaveButton } from "@/components/SaveButton";
import { TextEditor } from "@/components/TextEditor";
import { JOB_ARRANGEMENTS, JOB_TYPES } from "@/constants";
import { ResumeWorkEntry } from "@/generated/prisma";
import { t } from "@/translate";
import { FormEvent, useState } from "react";

type Props = {
  workEntry: ResumeWorkEntry;
  updateWorkEntry: (workEntry: ResumeWorkEntry) => Promise<void>;
  deleteWorkEntry: (workEntry: ResumeWorkEntry) => Promise<void>;
  moveWorkEntryUp: (workEntry: ResumeWorkEntry) => Promise<void>;
  moveWorkEntryDown: (workEntry: ResumeWorkEntry) => Promise<void>;
};

export function WorkEntryEditor({
  workEntry,
  updateWorkEntry,
  deleteWorkEntry,
  moveWorkEntryUp,
  moveWorkEntryDown,
}: Props) {
  const [companyName, setCompanyName] = useState(workEntry.companyName);
  const [companyLocation, setCompanyLocation] = useState(
    workEntry.companyLocation
  );
  const [title, setTitle] = useState(workEntry.title);
  const [type, setType] = useState(workEntry.type);
  const [arrangement, setArrangement] = useState(workEntry.arrangement);
  const [startDate, setStartDate] = useState(workEntry.startDate);
  const [endDate, setEndDate] = useState(workEntry.endDate);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateWorkEntry({
      id: workEntry.id,
      pid: workEntry.pid,
      resumeId: workEntry.resumeId,
      companyName,
      companyLocation,
      title,
      type,
      arrangement,
      startDate,
      endDate,
      enabled: workEntry.enabled,
      sortOrder: workEntry.sortOrder,
    });
  };

  const toggleEnabled = async () => {
    await updateWorkEntry({
      id: workEntry.id,
      pid: workEntry.pid,
      resumeId: workEntry.resumeId,
      companyName,
      companyLocation,
      title,
      type,
      arrangement,
      startDate,
      endDate,
      enabled: !workEntry.enabled,
      sortOrder: workEntry.sortOrder,
    });
  };

  const handleDelete = async () => {
    await deleteWorkEntry(workEntry);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-wrap gap-2 ${!workEntry.enabled && "bg-gray-400"}`}
    >
      <input
        className="block w-9"
        type="checkbox"
        checked={workEntry.enabled}
        onChange={toggleEnabled}
      />
      <TextEditor
        label="Company Name"
        value={companyName}
        setValue={setCompanyName}
        originalValue={workEntry.companyName}
      />
      <TextEditor
        label="Company Location"
        value={companyLocation}
        setValue={setCompanyLocation}
        originalValue={workEntry.companyLocation}
      />
      <TextEditor
        label="Title"
        value={title}
        setValue={setTitle}
        originalValue={workEntry.title}
      />
      <DropdownEditor
        label="Type"
        value={type}
        setValue={setType}
        originalValue={workEntry.type}
        options={JOB_TYPES}
        translations={t.jobType}
      />
      <DropdownEditor
        label="Arrangement"
        value={arrangement}
        setValue={setArrangement}
        originalValue={workEntry.arrangement}
        options={JOB_ARRANGEMENTS}
        translations={t.jobArrangement}
      />
      <DateEditor
        label="Start Date"
        value={startDate}
        setValue={setStartDate}
        originalValue={workEntry.startDate}
        required
      />
      <DateEditor
        label="End Date"
        value={endDate}
        setValue={setEndDate}
        originalValue={workEntry.endDate}
      />
      <MoveUpButton
        className="w-12"
        onClick={() => moveWorkEntryUp(workEntry)}
      />
      <MoveDownButton
        className="w-12"
        onClick={() => moveWorkEntryDown(workEntry)}
      />
      <SaveButton
        className="w-12"
        hasUnsavedChanges={
          companyName !== workEntry.companyName ||
          companyLocation !== workEntry.companyLocation ||
          title !== workEntry.title ||
          type !== workEntry.type ||
          arrangement !== workEntry.arrangement ||
          startDate !== workEntry.startDate ||
          endDate !== workEntry.endDate
        }
      />
      <DeleteButton className="w-12" onClick={handleDelete} />
    </form>
  );
}
