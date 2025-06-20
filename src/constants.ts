import {
  ContactMessageType,
  JobArrangement,
  JobStatus,
  JobType,
  ResumeTemplate,
} from "./generated/prisma";

export const JOB_TYPES = [...Object.values(JobType)] as const;
export const JOB_ARRANGEMENTS = [...Object.values(JobArrangement)] as const;
export const JOB_STATUSES = [...Object.values(JobStatus)] as const;
export const RESUME_TEMPLATES = [...Object.values(ResumeTemplate)] as const;
export const CONTACT_MESSAGE_TYPES = [
  ...Object.values(ContactMessageType),
] as const;
