import {
  DateEditor,
  DeleteButton,
  MoveDownButton,
  MoveUpButton,
  SaveButton,
  TextEditor,
} from "@/components";
import { ResumeCertification } from "@/generated/prisma";
import { FormEvent, useState } from "react";

type Props = {
  certification: ResumeCertification;
  updateCertification: (certification: ResumeCertification) => Promise<void>;
  deleteCertification: (certification: ResumeCertification) => Promise<void>;
  moveCertificationUp: (certification: ResumeCertification) => Promise<void>;
  moveCertificationDown: (certification: ResumeCertification) => Promise<void>;
};

export function CertificationEditor({
  certification,
  updateCertification,
  deleteCertification,
  moveCertificationUp,
  moveCertificationDown,
}: Props) {
  const [title, setTitle] = useState(certification.title);
  const [issuer, setIssuer] = useState(certification.issuer);
  const [issueDate, setIssueDate] = useState(certification.issueDate);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateCertification({
      id: certification.id,
      pid: certification.pid,
      resumeId: certification.resumeId,
      title,
      issuer,
      issueDate,
      enabled: certification.enabled,
      sortOrder: certification.sortOrder,
    });
  };

  const toggleEnabled = async () => {
    await updateCertification({
      id: certification.id,
      pid: certification.pid,
      resumeId: certification.resumeId,
      title: certification.title,
      issuer: certification.issuer,
      issueDate: certification.issueDate,
      enabled: !certification.enabled,
      sortOrder: certification.sortOrder,
    });
  };

  const handleDelete = async () => {
    await deleteCertification(certification);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-wrap gap-2 ${
        !certification.enabled && "bg-gray-400"
      }`}
    >
      <input
        className="block w-9"
        type="checkbox"
        checked={certification.enabled}
        onChange={toggleEnabled}
      />
      <TextEditor
        label="Title"
        value={title}
        setValue={setTitle}
        originalValue={certification.title}
      />
      <TextEditor
        label="Issuer"
        value={issuer}
        setValue={setIssuer}
        originalValue={certification.issuer}
      />
      <DateEditor
        label="Issue Date"
        value={issueDate}
        setValue={setIssueDate}
        originalValue={certification.issueDate}
        required
      />
      <MoveUpButton
        className="w-12"
        onClick={() => moveCertificationUp(certification)}
      />
      <MoveDownButton
        className="w-12"
        onClick={() => moveCertificationDown(certification)}
      />
      <SaveButton
        className="w-12"
        hasUnsavedChanges={
          title !== certification.title ||
          issuer !== certification.issuer ||
          issueDate !== certification.issueDate
        }
      />
      <DeleteButton className="w-12" onClick={handleDelete} />
    </form>
  );
}
