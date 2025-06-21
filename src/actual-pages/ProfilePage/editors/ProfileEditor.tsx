import { LongTextEditor } from "@/components/LongTextEditor";
import { SaveButton } from "@/components/SaveButton";
import { TextEditor } from "@/components/TextEditor";
import { Profile } from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { useProfileMutations } from "../useProfileMutations";
import { usePromptGenerators } from "../usePromptGenerators";

type Props = {
  profile: Profile;
};

export function ProfileEditor({ profile }: Props) {
  const [profileName, setProfileName] = useState(profile.profileName);
  const [jobTitle, setJobTitle] = useState(profile.jobTitle);
  const [name, setName] = useState(profile.name);
  const [location, setLocation] = useState(profile.location);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [websiteText, setWebsiteText] = useState(profile.websiteText);
  const [websiteLink, setWebsiteLink] = useState(profile.websiteLink);
  const [summary, setSummary] = useState(profile.summary);
  const [coverLetter, setCoverLetter] = useState(profile.coverLetter);
  const { updateProfile } = useProfileMutations();
  const { generateSummaryPrompt, generateCoverLetterPrompt } =
    usePromptGenerators();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateProfile({
      id: profile.id,
      pid: profile.pid,
      userId: profile.userId,
      profileName,
      jobTitle,
      name,
      location,
      phone,
      email,
      websiteText,
      websiteLink,
      summary,
      coverLetter,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="my-6 flex flex-wrap gap-4">
      <TextEditor
        label="Profile Name"
        value={profileName}
        setValue={setProfileName}
        originalValue={profile.profileName}
      />
      <TextEditor
        label="Job Title"
        value={jobTitle}
        setValue={setJobTitle}
        originalValue={profile.jobTitle}
      />
      <TextEditor
        label="Name"
        value={name}
        setValue={setName}
        originalValue={profile.name}
      />
      <TextEditor
        label="Location"
        value={location}
        setValue={setLocation}
        originalValue={profile.location}
      />
      <TextEditor
        label="Phone"
        type="tel"
        value={phone}
        setValue={setPhone}
        originalValue={profile.phone}
      />
      <TextEditor
        label="Email"
        type="email"
        value={email}
        setValue={setEmail}
        originalValue={profile.email}
      />
      <TextEditor
        label="Website Text"
        value={websiteText}
        setValue={setWebsiteText}
        originalValue={profile.websiteText}
      />
      <TextEditor
        label="Website Link"
        type="url"
        value={websiteLink}
        setValue={setWebsiteLink}
        originalValue={profile.websiteLink}
      />
      <LongTextEditor
        label="Summary"
        value={summary}
        setValue={setSummary}
        originalValue={profile.summary}
        className="w-5/12 min-h-40"
      />
      <LongTextEditor
        label="Cover Letter"
        value={coverLetter}
        setValue={setCoverLetter}
        originalValue={profile.coverLetter}
        className="w-5/12 min-h-40"
      />
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
            profileName !== profile.profileName ||
            jobTitle !== profile.jobTitle ||
            name !== profile.name ||
            location !== profile.location ||
            phone !== profile.phone ||
            email !== profile.email ||
            websiteText !== profile.websiteText ||
            websiteLink !== profile.websiteLink ||
            summary !== profile.summary ||
            coverLetter !== profile.coverLetter
          }
        />
      </div>
    </form>
  );
}
