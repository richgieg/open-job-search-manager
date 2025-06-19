import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import { createClient } from "@/lib/supabase/component";

export function Header() {
  const user = useUser();
  const router = useRouter();

  if (user) {
    const logOut = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    };
    return (
      <header className="flex w-full gap-8 p-8">
        <Link href="/">Home</Link>
        <Link href="/profiles">Profiles</Link>
        <Link href="/jobs">Jobs</Link>
        <div className="ml-auto">
          {user.email} | <button onClick={logOut}>Sign Out</button>
        </div>
      </header>
    );
  } else if (user === null) {
    return (
      <header className="text-right p-8">
        <Link href="/login">Sign In</Link>
      </header>
    );
  } else {
    return <></>;
  }
}
