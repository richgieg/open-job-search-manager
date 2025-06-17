import { DateEditor } from "@/components/DateEditor";
import { DropdownEditor } from "@/components/DropdownEditor";
import { LongTextEditor } from "@/components/LongTextEditor";
import { SaveButton } from "@/components/SaveButton";
import { TextEditor } from "@/components/TextEditor";
import { JOB_ARRANGEMENTS, JOB_STATUSES, JOB_TYPES } from "@/constants";
import { Job } from "@/generated/prisma";
import { t } from "@/translate";
import { FormEvent, useState } from "react";

type Props = {
  job: Job;
  updateJob: (job: Job) => Promise<void>;
};

export function JobEditor({ job, updateJob }: Props) {
  const [title, setTitle] = useState(job.title);
  const [company, setCompany] = useState(job.company);
  const [location, setLocation] = useState(job.location);
  const [type, setType] = useState(job.type);
  const [arrangement, setArrangement] = useState(job.arrangement);
  const [staffingCompany, setStaffingCompany] = useState(job.staffingCompany);
  const [description, setDescription] = useState(job.description);
  const [postedDate, setPostedDate] = useState(job.postedDate);
  const [appliedDate, setAppliedDate] = useState(job.appliedDate);
  const [status, setStatus] = useState(job.status);
  const [notes, setNotes] = useState(job.notes);
  const [postedSalary, setPostedSalary] = useState(job.postedSalary);
  const [desiredSalary, setDesiredSalary] = useState(job.desiredSalary);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateJob({
      id: job.id,
      pid: job.pid,
      createdAt: job.createdAt,
      title,
      company,
      location,
      type,
      arrangement,
      staffingCompany,
      description,
      postedDate,
      appliedDate,
      status,
      notes,
      postedSalary,
      desiredSalary,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="my-6 flex flex-wrap gap-4">
      <TextEditor
        label="Title"
        value={title}
        setValue={setTitle}
        originalValue={job.title}
      />
      <TextEditor
        label="Company"
        value={company}
        setValue={setCompany}
        originalValue={job.company}
      />
      <TextEditor
        label="Location"
        value={location}
        setValue={setLocation}
        originalValue={job.location}
      />
      <DropdownEditor
        label="Type"
        value={type}
        setValue={setType}
        originalValue={job.type}
        options={JOB_TYPES}
        translations={t.jobType}
        includeEmptyOption
      />
      <DropdownEditor
        label="Arrangement"
        value={arrangement}
        setValue={setArrangement}
        originalValue={job.arrangement}
        options={JOB_ARRANGEMENTS}
        translations={t.jobArrangement}
        includeEmptyOption
      />
      <TextEditor
        label="Staffing Company"
        value={staffingCompany}
        setValue={setStaffingCompany}
        originalValue={job.staffingCompany}
      />
      <DateEditor
        label="Posted Date"
        value={postedDate}
        setValue={setPostedDate}
        originalValue={job.postedDate}
      />
      <DateEditor
        label="Applied Date"
        value={appliedDate}
        setValue={setAppliedDate}
        originalValue={job.appliedDate}
      />
      <DropdownEditor
        label="Status"
        value={status}
        setValue={setStatus}
        originalValue={job.status}
        options={JOB_STATUSES}
        translations={t.jobStatus}
      />
      <TextEditor
        label="Salary"
        value={postedSalary}
        setValue={setPostedSalary}
        originalValue={job.postedSalary}
      />
      <TextEditor
        label="Desired Salary"
        value={desiredSalary}
        setValue={setDesiredSalary}
        originalValue={job.desiredSalary}
      />
      <div className="w-full flex gap-4">
        <LongTextEditor
          label="Description"
          value={description}
          setValue={setDescription}
          originalValue={job.description}
          className="w-5/12 min-h-40"
        />
        <LongTextEditor
          label="Notes"
          value={notes}
          setValue={setNotes}
          originalValue={job.notes}
          className="w-5/12 min-h-40"
        />
      </div>
      <div className="w-full">
        <SaveButton
          className="w-12 h-12"
          hasUnsavedChanges={
            title !== job.title ||
            company !== job.company ||
            location !== job.location ||
            type !== job.type ||
            arrangement !== job.arrangement ||
            staffingCompany !== job.staffingCompany ||
            description !== job.description ||
            postedDate !== job.postedDate ||
            appliedDate !== job.appliedDate ||
            status !== job.status ||
            notes !== job.notes ||
            postedSalary !== job.postedSalary ||
            desiredSalary !== job.desiredSalary
          }
        />
      </div>
    </form>
  );
}
