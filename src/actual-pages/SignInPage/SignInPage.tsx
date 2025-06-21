import { Header, SectionHeading, TextInput } from "@/components";
import { useUser } from "@/contexts/UserContext";
import { createClient } from "@/lib/supabase/component";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const user = useUser();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - Open Job Search Manager</title>
        <meta
          name="description"
          content="Sign in to access your job search dashboard."
        />
      </Head>
      <Header />
      <form
        className="flex flex-col gap-4 w-96 mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="self-end">
          Need an account? <Link href="/signup">Sign Up</Link>
        </div>
        <SectionHeading text="Sign In" />
        <TextInput
          ref={emailRef}
          type="email"
          label="Email"
          required
          value={email}
          setValue={setEmail}
        />
        <TextInput
          type="password"
          label="Password"
          required
          value={password}
          setValue={setPassword}
        />
        <button type="submit" className="self-end">
          Sign In
        </button>
        {error && (
          <div className="bg-red-500 text-center text-white rounded-lg px-4 py-3">
            Error: {error.message}
          </div>
        )}
      </form>
    </>
  );
}
