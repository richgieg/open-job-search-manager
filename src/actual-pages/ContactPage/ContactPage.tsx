import { DropdownInput } from "@/components/DropdownInput";
import { Header } from "@/components/Header";
import { LongTextInput } from "@/components/LongTextInput";
import MetaNoIndex from "@/components/MetaNoIndex";
import { SectionHeading } from "@/components/SectionHeading";
import { CONTACT_MESSAGE_TYPES } from "@/constants";
import { ContactMessageType } from "@/generated/prisma";
import { t } from "@/translate";
import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";

export function ContactPage() {
  const [type, setType] = useState<ContactMessageType>(
    CONTACT_MESSAGE_TYPES[0]
  );
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => setSuccess(false), [type]);
  useEffect(() => setSuccess(false), [message]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    await fetch(`/api/contactMessages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, message }),
    });
    setSuccess(true);
  };

  return (
    <>
      <MetaNoIndex />
      <Head>
        <title>Contact Us - Open Job Search Manager</title>
      </Head>
      <Header />
      <form
        className="flex flex-col gap-4 w-96 mx-auto"
        onSubmit={handleSubmit}
      >
        <SectionHeading text="Contact Us" />
        <DropdownInput
          label="Type"
          options={CONTACT_MESSAGE_TYPES}
          translations={t.contactMessageTypes}
          value={type}
          setValue={setType}
        />
        <LongTextInput
          className="h-48"
          label="Message"
          required
          value={message}
          setValue={setMessage}
        />
        <button type="submit" className="self-end">
          Send
        </button>
        {success && (
          <div className="bg-green-700 text-center text-white rounded-lg px-4 py-3 w-96 mx-auto">
            Your message has been sent.
            <br />
            Thanks for reaching out!
          </div>
        )}
      </form>
    </>
  );
}
