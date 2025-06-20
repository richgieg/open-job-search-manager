import { Header } from "@/components/Header";
import { SectionHeading } from "@/components/SectionHeading";
import Head from "next/head";
import { FormEvent } from "react";

export function ContactPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <Head>
        <title>Contact Us - Open Job Search Manager</title>
      </Head>
      <Header />
      <form
        className="flex flex-col gap-4 w-96 mx-auto"
        onSubmit={handleSubmit}
      >
        <SectionHeading text="Contact Us" />
        <button type="submit" className="self-end">
          Send
        </button>
      </form>
    </>
  );
}
