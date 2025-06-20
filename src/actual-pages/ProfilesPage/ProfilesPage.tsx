import { MainContent } from "./MainContent";
import { Profile } from "@/generated/prisma";
import Head from "next/head";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useSWR from "swr";
import { ProfilesProvider } from "./ProfilesContext";
import { Header, MetaNoIndex } from "@/components";

export function ProfilesPage() {
  const user = useAuthRedirect();

  const { data: profiles, mutate: mutateProfiles } = useSWR(
    user ? "/api/profiles" : null,
    async (url) => {
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData as Profile[];
    }
  );

  return (
    <>
      <MetaNoIndex />
      <Head>
        <title>Profiles - Open Job Search Manager</title>
      </Head>
      <Header />
      {profiles && (
        <ProfilesProvider profiles={profiles} mutateProfiles={mutateProfiles}>
          <MainContent />
        </ProfilesProvider>
      )}
    </>
  );
}
