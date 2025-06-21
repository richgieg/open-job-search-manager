import type { FullResume } from "@/types";
import { createContext, ReactNode, useContext } from "react";
import { KeyedMutator } from "swr";

const FullResumeContext = createContext<{
  fullResume: FullResume;
  mutateFullResume: KeyedMutator<FullResume>;
} | null>(null);

type Props = {
  fullResume: FullResume;
  mutateFullResume: KeyedMutator<FullResume>;
  children?: ReactNode;
};

export const FullResumeProvider = ({
  fullResume,
  mutateFullResume,
  children,
}: Props) => (
  <FullResumeContext.Provider value={{ fullResume, mutateFullResume }}>
    {children}
  </FullResumeContext.Provider>
);

export const useFullResumeContext = () => {
  const ctx = useContext(FullResumeContext);
  if (!ctx) {
    throw new Error(
      "useFullResumeContext must be used within FullResumeProvider"
    );
  }
  return ctx;
};
