import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MainContent } from "./MainContent";
import Head from "next/head";
import { t } from "@/translate";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useSWR from "swr";
import { FullProfileProvider } from "./FullProfileContext";
import { Header, MetaNoIndex } from "@/components";
import type { FullProfile } from "@/types";

export function ProfilePage() {
  const user = useAuthRedirect();
  const router = useRouter();
  const [profilePid, setProfilePid] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setProfilePid(router.query.profilePid as string);
  }, [router]);

  const { data: fullProfile, mutate: mutateFullProfile } = useSWR(
    user && profilePid ? `/api/profiles/${profilePid}/full` : null,
    async (url) => {
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData as FullProfile;
    }
  );

  return (
    <>
      <MetaNoIndex />
      <Head>
        {fullProfile && (
          <title>
            {fullProfile.profileName || t.profileNamePlaceholder} -{" "}
            {"Profiles - Open Job Search Manager"}
          </title>
        )}
        {!fullProfile && (
          <title>Loading Profile... - Open Job Search Manager</title>
        )}
      </Head>
      <Header />
      {fullProfile && (
        <FullProfileProvider
          fullProfile={fullProfile}
          mutateFullProfile={mutateFullProfile}
        >
          <MainContent />
        </FullProfileProvider>
      )}
    </>
  );
}
