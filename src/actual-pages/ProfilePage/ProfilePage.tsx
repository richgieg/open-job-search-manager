import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { MainContent } from "./MainContent";
import {
  Certification,
  EducationEntry,
  EducationEntryBullet,
  Profile,
  Skill,
  SkillCategory,
  WorkEntry,
  WorkEntryBullet,
} from "@/generated/prisma";
import Head from "next/head";
import { t } from "@/translate";

type FullProfile = Profile & {
  workEntries: (WorkEntry & { bullets: WorkEntryBullet[] })[];
  educationEntries: (EducationEntry & { bullets: EducationEntryBullet[] })[];
  certifications: Certification[];
  skillCategories: (SkillCategory & { skills: Skill[] })[];
};

export function ProfilePage() {
  const router = useRouter();
  const [profilePid, setProfilePid] = useState<string | null>(null);
  const [fullProfile, setFullProfile] = useState<FullProfile | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setProfilePid(router.query.profilePid as string);
  }, [router]);

  useEffect(() => {
    if (!profilePid) return;
    const fetchFullProfile = async () => {
      const response = await fetch(`/api/profiles/${profilePid}/full`);
      const responseData = await response.json();
      setFullProfile(responseData);
    };
    fetchFullProfile();
  }, [profilePid]);

  return (
    <>
      <Head>
        {fullProfile && (
          <title>
            {fullProfile.profileName || t.profileNamePlaceholder} Profile -{" "}
            {"Open Job Search Manager"}
          </title>
        )}
        {!fullProfile && (
          <title>Loading Profile... - Open Job Search Manager</title>
        )}
      </Head>
      <Header />
      {fullProfile && (
        <MainContent
          fullProfile={fullProfile}
          setFullProfile={setFullProfile}
        />
      )}
    </>
  );
}
