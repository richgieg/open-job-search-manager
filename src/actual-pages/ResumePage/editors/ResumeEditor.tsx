import {
  DropdownEditor,
  LongTextEditor,
  SaveButton,
  TextEditor,
} from "@/components";
import { RESUME_TEMPLATES } from "@/constants";
import { Profile, Resume } from "@/generated/prisma";
import { t } from "@/translate";
import NextLink from "next/link";
import { FormEvent, useState } from "react";
import { useResumeMutations } from "../mutations";
import { usePromptGenerators } from "../usePromptGenerators";
import type { FullJob } from "@/types";

type ResumeWithProfile = Resume & {
  profile: Profile | null;
};

type Props = {
  resume: ResumeWithProfile;
  fullJob: FullJob;
};

export function ResumeEditor({ resume, fullJob }: Props) {
  const [resumeName, setResumeName] = useState(resume.resumeName);
  const [name, setName] = useState(resume.name);
  const [location, setLocation] = useState(resume.location);
  const [phone, setPhone] = useState(resume.phone);
  const [email, setEmail] = useState(resume.email);
  const [websiteText, setWebsiteText] = useState(resume.websiteText);
  const [websiteLink, setWebsiteLink] = useState(resume.websiteLink);
  const [summary, setSummary] = useState(resume.summary);
  const [coverLetter, setCoverLetter] = useState(resume.coverLetter);
  const [allowPageBreaks, setAllowPageBreaks] = useState(
    resume.allowPageBreaks
  );
  const [template, setTemplate] = useState(resume.template);
  const { updateResume } = useResumeMutations();
  const { generateSummaryPrompt, generateCoverLetterPrompt } =
    usePromptGenerators(fullJob);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateResume({
      id: resume.id,
      pid: resume.pid,
      jobId: resume.jobId,
      profileId: resume.profileId,
      resumeName,
      name,
      location,
      phone,
      email,
      websiteText,
      websiteLink,
      summary,
      coverLetter,
      allowPageBreaks,
      template,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="my-6 flex flex-wrap gap-4">
      <div className="w-full">
        Profile:{" "}
        {resume.profile ? (
          <NextLink href={`/profiles/${resume.profile.pid}`}>
            {resume.profile.pid}
          </NextLink>
        ) : (
          "(deleted)"
        )}
      </div>
      <TextEditor
        label="Resume Name"
        value={resumeName}
        setValue={setResumeName}
        originalValue={resume.resumeName}
      />
      <TextEditor
        label="Name"
        value={name}
        setValue={setName}
        originalValue={resume.name}
      />
      <TextEditor
        label="Location"
        value={location}
        setValue={setLocation}
        originalValue={resume.location}
      />
      <TextEditor
        label="Phone"
        type="tel"
        value={phone}
        setValue={setPhone}
        originalValue={resume.phone}
      />
      <TextEditor
        label="Email"
        type="email"
        value={email}
        setValue={setEmail}
        originalValue={resume.email}
      />
      <TextEditor
        label="Website Text"
        value={websiteText}
        setValue={setWebsiteText}
        originalValue={resume.websiteText}
      />
      <TextEditor
        label="Website Link"
        type="url"
        value={websiteLink}
        setValue={setWebsiteLink}
        originalValue={resume.websiteLink}
      />
      <LongTextEditor
        label="Summary"
        value={summary}
        setValue={setSummary}
        originalValue={resume.summary}
        className="w-5/12 min-h-40"
      />
      <LongTextEditor
        label="Cover Letter"
        value={coverLetter}
        setValue={setCoverLetter}
        originalValue={resume.coverLetter}
        className="w-5/12 min-h-40"
      />
      <div className="w-full flex gap-4">
        <DropdownEditor
          label="Template"
          value={template}
          setValue={setTemplate}
          originalValue={resume.template}
          options={RESUME_TEMPLATES}
          translations={t.resumeTemplates}
        />
        <label className="block">
          <span>Allow Section Page Breaks</span>
          <input
            className="ml-2 border-2"
            type="checkbox"
            checked={allowPageBreaks}
            onChange={(e) => setAllowPageBreaks(e.target.checked)}
          />
        </label>
      </div>
      <div className="w-full flex gap-2">
        <button
          className="border-1 h-12 px-4"
          type="button"
          title="Create an LLM prompt for generating a summary and copy it to the clipboard"
          onClick={generateSummaryPrompt}
        >
          ✨ Summary Prompt
        </button>
        <button
          className="border-1 h-12 px-4"
          type="button"
          title="Create an LLM prompt for generating a cover letter and copy it to the clipboard"
          onClick={generateCoverLetterPrompt}
        >
          💫 Cover Letter Prompt
        </button>
        <SaveButton
          className="w-12 h-12"
          hasUnsavedChanges={
            resumeName !== resume.resumeName ||
            name !== resume.name ||
            location !== resume.location ||
            phone !== resume.phone ||
            email !== resume.email ||
            websiteText !== resume.websiteText ||
            websiteLink !== resume.websiteLink ||
            summary !== resume.summary ||
            coverLetter !== resume.coverLetter ||
            allowPageBreaks !== resume.allowPageBreaks ||
            template !== resume.template
          }
        />
      </div>
    </form>
  );
}
