import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { createClient } from "@/lib/supabase/component";
import { mutate } from "swr";

export function Header() {
  const user = useUser();

  if (user) {
    const logOut = async () => {
      const supabase = createClient();
      // TODO: Handle errors
      await supabase.auth.signOut();
      // Clear everything from the SWR cache.
      mutate(() => true, undefined, { revalidate: false });
    };
    return (
      <header className="flex w-full gap-8 p-8">
        <Link href="/">Home</Link>
        <Link href="/profiles">Profiles</Link>
        <Link href="/jobs">Jobs</Link>
        <Link href="/contact">Contact Us</Link>
        <div className="ml-auto">
          {user.email} | <button onClick={logOut}>Sign Out</button>
        </div>
      </header>
    );
  } else if (user === null) {
    return (
      <header className="text-right p-8">
        <Link href="/signin">Sign In</Link>
      </header>
    );
  } else {
    return <header className="p-8">&nbsp;</header>;
  }
}
