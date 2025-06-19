import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";

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
      <div className="flex w-full gap-8">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/profiles">Profiles</Link>
        <Link href="/jobs">Jobs</Link>
        <div className="ml-auto">
          {user.email} | <button onClick={logOut}>Log Out</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-right">
        <Link href="/login">Log In</Link>
      </div>
    );
  }
}
