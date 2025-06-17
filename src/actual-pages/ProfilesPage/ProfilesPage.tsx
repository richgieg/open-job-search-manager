import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { MainContent } from "./MainContent";
import { Profile } from "@/generated/prisma";

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
      <Header />
      {profiles && (
        <MainContent profiles={profiles} setProfiles={setProfiles} />
      )}
    </>
  );
}
