import { Header } from "@/components/Header";
import MetaNoIndex from "@/components/MetaNoIndex";
import Head from "next/head";

export function ErrorPage() {
  return (
    <>
      <MetaNoIndex />
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
