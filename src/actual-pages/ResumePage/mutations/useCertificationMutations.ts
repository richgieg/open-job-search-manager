import { ResumeCertification } from "@/generated/prisma";
import { useFullResumeContext } from "../FullResumeContext";

export function useCertificationMutations() {
  const { fullResume, mutateFullResume } = useFullResumeContext();

  const createCertification = async () => {
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/certifications`,
      {
        method: "POST",
      }
    );
    const certification: ResumeCertification = await response.json();
    mutateFullResume(
      {
        ...fullResume,
        certifications: [...fullResume.certifications, certification],
      },
      { revalidate: false }
    );
  };

  const updateCertification = async (certification: ResumeCertification) => {
    mutateFullResume(
      {
        ...fullResume,
        certifications: fullResume.certifications.map((c) => {
          if (c.id === certification.id) {
            return { ...c, ...certification };
          } else {
            return c;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/resumeCertifications/${certification.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(certification),
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const deleteCertification = async (certification: ResumeCertification) => {
    mutateFullResume(
      {
        ...fullResume,
        certifications: fullResume.certifications.filter(
          (c) => c.id !== certification.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/resumeCertifications/${certification.pid}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const moveCertificationUp = async (certification: ResumeCertification) => {
    const certifications = [...fullResume.certifications];
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
    mutateFullResume({ ...fullResume, certifications }, { revalidate: false });
    const orderedPids = certifications.map((item) => item.pid);
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/certifications/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
    }
  };

  const moveCertificationDown = async (certification: ResumeCertification) => {
    const certifications = [...fullResume.certifications];
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
    mutateFullResume({ ...fullResume, certifications }, { revalidate: false });
    const orderedPids = certifications.map((item) => item.pid);
    const response = await fetch(
      `/api/resumes/${fullResume.pid}/certifications/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullResume(fullResume, { revalidate: true });
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
