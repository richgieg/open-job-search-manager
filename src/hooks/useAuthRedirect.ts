import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";

export function useAuthRedirect() {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user === null) {
      router.replace("/signin");
    }
  }, [router, user]);

  return user;
}
