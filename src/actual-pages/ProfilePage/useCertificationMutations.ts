import { Certification } from "@/generated/prisma";
import { useFullProfileContext } from "./FullProfileContext";

export function useCertificationMutations() {
  const { fullProfile, mutateFullProfile } = useFullProfileContext();

  const createCertification = async () => {
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/certifications`,
      {
        method: "POST",
      }
    );
    const certification: Certification = await response.json();
    mutateFullProfile(
      {
        ...fullProfile,
        certifications: [...fullProfile.certifications, certification],
      },
      { revalidate: false }
    );
  };

  const updateCertification = async (certification: Certification) => {
    mutateFullProfile(
      {
        ...fullProfile,
        certifications: fullProfile.certifications.map((c) => {
          if (c.id === certification.id) {
            return { ...c, ...certification };
          } else {
            return c;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/certifications/${certification.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(certification),
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const deleteCertification = async (certification: Certification) => {
    mutateFullProfile(
      {
        ...fullProfile,
        certifications: fullProfile.certifications.filter(
          (c) => c.id !== certification.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(`/api/certifications/${certification.pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const moveCertificationUp = async (certification: Certification) => {
    const certifications = [...fullProfile.certifications];
    const index = certifications.findIndex(
      (item) => item.id === certification.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [certifications[index], certifications[swapIndex]] = [
        certifications[swapIndex],
        certifications[index],
      ];
    } else {
      certifications.push(certifications.shift()!);
    }
    mutateFullProfile(
      { ...fullProfile, certifications },
      { revalidate: false }
    );
    const orderedPids = certifications.map((item) => item.pid);
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/certifications/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  const moveCertificationDown = async (certification: Certification) => {
    const certifications = [...fullProfile.certifications];
    const index = certifications.findIndex(
      (item) => item.id === certification.id
    );
    if (index < certifications.length - 1) {
      const swapIndex = index + 1;
      [certifications[index], certifications[swapIndex]] = [
        certifications[swapIndex],
        certifications[index],
      ];
    } else {
      certifications.unshift(certifications.pop()!);
    }
    mutateFullProfile(
      { ...fullProfile, certifications },
      { revalidate: false }
    );
    const orderedPids = certifications.map((item) => item.pid);
    const response = await fetch(
      `/api/profiles/${fullProfile.pid}/certifications/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullProfile(fullProfile, { revalidate: true });
    }
  };

  return {
    createCertification,
    updateCertification,
    deleteCertification,
    moveCertificationUp,
    moveCertificationDown,
  };
}
