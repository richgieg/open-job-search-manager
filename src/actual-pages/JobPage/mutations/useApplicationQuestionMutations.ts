import { ApplicationQuestion } from "@/generated/prisma";
import { useFullJobContext } from "../FullJobContext";

export function useApplicationQuestionMutations() {
  const { fullJob, mutateFullJob } = useFullJobContext();

  const createApplicationQuestion = async () => {
    const response = await fetch(
      `/api/jobs/${fullJob.pid}/applicationQuestions`,
      {
        method: "POST",
      }
    );
    const applicationQuestion: ApplicationQuestion = await response.json();
    mutateFullJob(
      {
        ...fullJob,
        applicationQuestions: [
          ...fullJob.applicationQuestions,
          applicationQuestion,
        ],
      },
      { revalidate: false }
    );
  };

  const updateApplicationQuestion = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    mutateFullJob(
      {
        ...fullJob,
        applicationQuestions: fullJob.applicationQuestions.map((a) => {
          if (a.id === applicationQuestion.id) {
            return applicationQuestion;
          } else {
            return a;
          }
        }),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/applicationQuestions/${applicationQuestion.pid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationQuestion),
      }
    );
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const deleteApplicationQuestion = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    mutateFullJob(
      {
        ...fullJob,
        applicationQuestions: fullJob.applicationQuestions.filter(
          (q) => q.id !== applicationQuestion.id
        ),
      },
      { revalidate: false }
    );
    const response = await fetch(
      `/api/applicationQuestions/${applicationQuestion.pid}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const moveApplicationQuestionUp = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    const applicationQuestions = [...fullJob.applicationQuestions];
    const index = applicationQuestions.findIndex(
      (item) => item.id === applicationQuestion.id
    );
    if (index > 0) {
      const swapIndex = index - 1;
      [applicationQuestions[index], applicationQuestions[swapIndex]] = [
        applicationQuestions[swapIndex],
        applicationQuestions[index],
      ];
    } else {
      applicationQuestions.push(applicationQuestions.shift()!);
    }
    mutateFullJob({ ...fullJob, applicationQuestions }, { revalidate: false });
    const orderedPids = applicationQuestions.map((item) => item.pid);
    const response = await fetch(
      `/api/jobs/${fullJob.pid}/applicationQuestions/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  const moveApplicationQuestionDown = async (
    applicationQuestion: ApplicationQuestion
  ) => {
    const applicationQuestions = [...fullJob.applicationQuestions];
    const index = applicationQuestions.findIndex(
      (item) => item.id === applicationQuestion.id
    );
    if (index < applicationQuestions.length - 1) {
      const swapIndex = index + 1;
      [applicationQuestions[index], applicationQuestions[swapIndex]] = [
        applicationQuestions[swapIndex],
        applicationQuestions[index],
      ];
    } else {
      applicationQuestions.unshift(applicationQuestions.pop()!);
    }
    mutateFullJob({ ...fullJob, applicationQuestions }, { revalidate: false });
    const orderedPids = applicationQuestions.map((item) => item.pid);
    const response = await fetch(
      `/api/jobs/${fullJob.pid}/applicationQuestions/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedPids }),
      }
    );
    if (!response.ok) {
      mutateFullJob(fullJob, { revalidate: true });
    }
  };

  return {
    createApplicationQuestion,
    updateApplicationQuestion,
    deleteApplicationQuestion,
    moveApplicationQuestionUp,
    moveApplicationQuestionDown,
  };
}
