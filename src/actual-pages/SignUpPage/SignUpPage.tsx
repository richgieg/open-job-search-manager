import { Header } from "@/components/Header";
import { SectionHeading } from "@/components/SectionHeading";
import { TextInput } from "@/components/TextInput";
import { useUser } from "@/contexts/UserContext";
import { createClient } from "@/lib/supabase/component";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";

export function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
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
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error);
    } else {
      setPassword("");
      setSuccess(true);
    }
  };

  return (
    <div>
      <Header />
      <form
        className="flex flex-col gap-4 w-96 mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="self-end">
          Already have an account? <Link href="/signin">Sign In</Link>
        </div>
        <SectionHeading text="Sign Up" />
        <TextInput
          ref={emailRef}
          type="email"
          label="Email"
          required
          disabled={success}
          value={email}
          setValue={setEmail}
        />
        <TextInput
          type="password"
          label="Password"
          required
          disabled={success}
          value={password}
          setValue={setPassword}
        />
        <button type="submit" className="self-end" disabled={success}>
          Sign Up
        </button>
        {error && (
          <div className="bg-red-500 text-center text-white rounded-lg px-4 py-3">
            Error: {error.message}
          </div>
        )}
        {success && (
          <div className="bg-green-700 text-center text-white rounded-lg px-4 py-3 w-96 mx-auto">
            Thanks for signing up!
            <br />
            Please check your email for the confirmation link.
          </div>
        )}
      </form>
    </div>
  );
}
