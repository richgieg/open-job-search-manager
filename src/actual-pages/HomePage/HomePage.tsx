import Head from "next/head";
import Image from "next/image";
import { Header } from "@/components/Header";

export function HomePage() {
  return (
    <>
      <Head>
        <title>Open Job Search Manager – Under Construction</title>
      </Head>
      <div className="flex flex-col h-dvh">
        <Header></Header>
        <div
          style={{
            display: "flex",
            flexGrow: "1",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            fontFamily: "sans-serif",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          <Image
            src="/logo.png"
            alt="Open Job Search Manager logo"
            style={{ width: "96px", height: "96px", marginBottom: "1rem" }}
            width={1024}
            height={1024}
          />
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Open Job Search Manager
          </h1>
          <p
            style={{ fontSize: "1.25rem", color: "#555", marginBottom: "1rem" }}
          >
            🚧 This site is under construction.
          </p>
          <a
            href="https://github.com/richgieg/open-job-search-manager"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "1rem",
              color: "#0070f3",
              textDecoration: "none",
            }}
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </>
  );
}
