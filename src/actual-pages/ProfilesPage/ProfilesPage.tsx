import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { MainContent } from "./MainContent";
import { Profile } from "@/generated/prisma";
import Head from "next/head";
import MetaNoIndex from "@/components/MetaNoIndex";

export function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const response = await fetch(`/api/profiles`);
      const responseData = await response.json();
      setProfiles(responseData);
    };
    fetchProfiles();
  }, []);

  return (
    <>
      <MetaNoIndex />
      <Head>
        <title>Profiles - Open Job Search Manager</title>
      </Head>
      <Header />
      {profiles && (
        <MainContent profiles={profiles} setProfiles={setProfiles} />
      )}
    </>
  );
}
