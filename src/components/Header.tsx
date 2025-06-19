import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";

export function Header() {
  const user = useUser();
  const router = useRouter();

  if (user) {
    const logOut = async () => {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/");
      } else {
        alert("Could not log out!");
      }
    };
    return (
      <header className="flex w-full gap-8">
        <Link href="/">Home</Link>
        <Link href="/profiles">Profiles</Link>
        <Link href="/jobs">Jobs</Link>
        <div className="ml-auto">
          {user.email} | <button onClick={logOut}>Log Out</button>
        </div>
      </header>
    );
  } else {
    return (
      <header className="text-right">
        <Link href="/login">Log In</Link>
      </header>
    );
  }
}
