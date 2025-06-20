import type {
  JobStatus,
  JobArrangement,
  JobType,
  ResumeTemplate,
  ContactMessageType,
} from "@/generated/prisma";

export const t = {
  jobType: {
    fullTime: "Full-Time",
    partTime: "Part-Time",
    contract: "Contract",
  } satisfies { [Key in JobType]: string },
  jobArrangement: {
    onSite: "On-Site",
    hybrid: "Hybrid",
    remote: "Remote",
  } satisfies { [Key in JobArrangement]: string },
  jobStatus: {
    notApplied: "Not Applied",
    applied: "Applied",
    appliedWithdrawn: "Applied - Withdrawn",
    appliedRejected: "Applied - Rejected",
    interviewing: "Interviewing",
    interviewedWithdrawn: "Interviewed - Withdrawn",
    interviewedRejected: "Interviewed - Rejected",
    offerReceived: "Offer Received",
    offerAccepted: "Offer Accepted",
  } satisfies { [Key in JobStatus]: string },
  resumeTemplates: {
    template01: "Template 01",
    template02: "Template 02",
  } satisfies { [Key in ResumeTemplate]: string },
  contactMessageTypes: {
    support: "Support",
    feedback: "Feedback",
    featureRequest: "Feature Request",
    other: "Other",
  } satisfies { [Key in ContactMessageType]: string },
  profileNamePlaceholder: "[No Name]",
  resumeNamePlaceholder: "[No Name]",
  jobTitlePlaceholder: "[No Title]",
} as const;
