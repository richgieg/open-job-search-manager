import { Header } from "@/components/Header";
import Head from "next/head";

export function ErrorPage() {
  return (
    <>
      <Head>
        <title>Error - Open Job Search Manager</title>
      </Head>
      <Header />
      <div className="m-8 p-8 text-2xl text-center">
        An error occurred. Please try again.
      </div>
    </>
  );
}
