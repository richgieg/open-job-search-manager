import { Contact } from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { useContactMutations } from "../mutations";
import {
  DeleteButton,
  DuplicateButton,
  MoveDownButton,
  MoveUpButton,
  SaveButton,
  TextEditor,
} from "@/components";

type Props = {
  contact: Contact;
};

export function ContactEditor({ contact }: Props) {
  const [name, setName] = useState(contact.name);
  const [title, setTitle] = useState(contact.title);
  const [phone, setPhone] = useState(contact.phone);
  const [email, setEmail] = useState(contact.email);
  const [company, setCompany] = useState(contact.company);
  const [addressLine1, setAddressLine1] = useState(contact.addressLine1);
  const [addressLine2, setAddressLine2] = useState(contact.addressLine2);
  const [addressLine3, setAddressLine3] = useState(contact.addressLine3);
  const [addressLine4, setAddressLine4] = useState(contact.addressLine4);
  const {
    updateContact,
    duplicateContact,
    deleteContact,
    moveContactUp,
    moveContactDown,
  } = useContactMutations();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateContact({
      id: contact.id,
      pid: contact.pid,
      jobId: contact.jobId,
      sortOrder: contact.sortOrder,
      name,
      title,
      phone,
      email,
      company,
      addressLine1,
      addressLine2,
      addressLine3,
      addressLine4,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <TextEditor
        label="Name"
        value={name}
        setValue={setName}
        originalValue={contact.name}
      />
      <TextEditor
        label="Title"
        value={title}
        setValue={setTitle}
        originalValue={contact.title}
      />
      <TextEditor
        label="Phone"
        type="tel"
        value={phone}
        setValue={setPhone}
        originalValue={contact.phone}
      />
      <TextEditor
        label="Email"
        type="email"
        value={email}
        setValue={setEmail}
        originalValue={contact.email}
      />
      <TextEditor
        label="Company"
        value={company}
        setValue={setCompany}
        originalValue={contact.company}
      />
      <TextEditor
        label="Address Line 1"
        value={addressLine1}
        setValue={setAddressLine1}
        originalValue={contact.addressLine1}
      />
      <TextEditor
        label="Address Line 2"
        value={addressLine2}
        setValue={setAddressLine2}
        originalValue={contact.addressLine2}
      />
      <TextEditor
        label="Address Line 3"
        value={addressLine3}
        setValue={setAddressLine3}
        originalValue={contact.addressLine3}
      />
      <TextEditor
        label="Address Line 4"
        value={addressLine4}
        setValue={setAddressLine4}
        originalValue={contact.addressLine4}
      />
      <MoveUpButton className="w-12" onClick={() => moveContactUp(contact)} />
      <MoveDownButton
        className="w-12"
        onClick={() => moveContactDown(contact)}
      />
      <SaveButton
        className="w-12"
        hasUnsavedChanges={
          name !== contact.name ||
          title !== contact.title ||
          phone !== contact.phone ||
          email !== contact.email ||
          company !== contact.company ||
          addressLine1 !== contact.addressLine1 ||
          addressLine2 !== contact.addressLine2 ||
          addressLine3 !== contact.addressLine3 ||
          addressLine4 !== contact.addressLine4
        }
      />
      <DuplicateButton
        className="w-12"
        onClick={() => duplicateContact(contact)}
      />
      <DeleteButton className="w-12" onClick={() => deleteContact(contact)} />
    </form>
  );
}
