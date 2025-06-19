import {
  JobArrangement,
  JobStatus,
  JobType,
  ResumeTemplate,
} from "@/generated/prisma";
import { z } from "zod";

export const pidSchema = z.string().uuid();

export const jobTypeSchema = z.enum([...Object.values(JobType)] as [
  keyof typeof JobType,
  ...(keyof typeof JobType)[]
]);

export const jobArrangementSchema = z.enum([
  ...Object.values(JobArrangement),
] as [keyof typeof JobArrangement, ...(keyof typeof JobArrangement)[]]);

export const jobStatusSchema = z.enum([...Object.values(JobStatus)] as [
  keyof typeof JobStatus,
  ...(keyof typeof JobStatus)[]
]);

export const resumeTemplateSchema = z.enum([
  ...Object.values(ResumeTemplate),
] as [keyof typeof ResumeTemplate, ...(keyof typeof ResumeTemplate)[]]);
