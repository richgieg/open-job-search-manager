import { createContext, ReactNode, useContext } from "react";
import { KeyedMutator } from "swr";
import type { FullJob } from "@/types";

const FullJobContext = createContext<{
  fullJob: FullJob;
  mutateFullJob: KeyedMutator<FullJob>;
} | null>(null);

type Props = {
  fullJob: FullJob;
  mutateFullJob: KeyedMutator<FullJob>;
  children?: ReactNode;
};

export const FullJobProvider = ({
  fullJob,
  mutateFullJob,
  children,
}: Props) => (
  <FullJobContext.Provider value={{ fullJob, mutateFullJob }}>
    {children}
  </FullJobContext.Provider>
);

export const useFullJobContext = () => {
  const ctx = useContext(FullJobContext);
  if (!ctx) {
    throw new Error("useFullJobContext must be used within FullJobProvider");
  }
  return ctx;
};
