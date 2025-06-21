import { ApplicationQuestion } from "@/generated/prisma";
import { FormEvent, useState } from "react";
import { useApplicationQuestionMutations } from "../mutations";
import {
  DeleteButton,
  LongTextEditor,
  MoveDownButton,
  MoveUpButton,
  SaveButton,
} from "@/components";

type Props = {
  applicationQuestion: ApplicationQuestion;
};

export function ApplicationQuestionEditor({ applicationQuestion }: Props) {
  const [question, setQuestion] = useState(applicationQuestion.question);
  const [answer, setAnswer] = useState(applicationQuestion.answer);
  const {
    updateApplicationQuestion,
    deleteApplicationQuestion,
    moveApplicationQuestionUp,
    moveApplicationQuestionDown,
  } = useApplicationQuestionMutations();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateApplicationQuestion({
      id: applicationQuestion.id,
      pid: applicationQuestion.pid,
      jobId: applicationQuestion.jobId,
      sortOrder: applicationQuestion.sortOrder,
      question,
      answer,
    });
  };

  const handleDelete = async () => {
    await deleteApplicationQuestion(applicationQuestion);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <LongTextEditor
        label="Question"
        value={question}
        setValue={setQuestion}
        originalValue={applicationQuestion.question}
        className="w-5/12"
      />
      <LongTextEditor
        label="Answer"
        value={answer}
        setValue={setAnswer}
        originalValue={applicationQuestion.answer}
        className="w-5/12"
      />
      <MoveUpButton
        className="w-12"
        onClick={() => moveApplicationQuestionUp(applicationQuestion)}
      />
      <MoveDownButton
        className="w-12"
        onClick={() => moveApplicationQuestionDown(applicationQuestion)}
      />
      <SaveButton
        className="w-12"
        hasUnsavedChanges={
          question !== applicationQuestion.question ||
          answer !== applicationQuestion.answer
        }
      />
      <DeleteButton className="w-12" onClick={handleDelete} />
    </form>
  );
}
