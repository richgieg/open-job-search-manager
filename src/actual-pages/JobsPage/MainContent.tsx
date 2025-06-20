import { t } from "@/translate";
import NextLink from "next/link";
import React, { FormEvent, ReactNode } from "react";
import { useJobMutations } from "./useJobMutations";
import { useJobsWithLinksContext } from "./JobsWithLinksContext";
import { DeleteButton, SectionHeading } from "@/components";

export function MainContent() {
  const { jobsWithLinks } = useJobsWithLinksContext();
  const { createJob, deleteJob } = useJobMutations();

  const handleCreateJob = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createJob();
  };

  return (
    <div className="px-8 pb-28">
      <SectionHeading text="Jobs" />
      <form onSubmit={handleCreateJob} className="mt-6">
        <button type="submit">New Job</button>
      </form>
      <div className="mt-6 flex flex-col gap-6">
        {jobsWithLinks.length > 0 && (
          <table className="table-auto border border-collapse border-gray-300 text-sm">
            <thead>
              <tr className="text-left">
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell>Company / Staffing Company</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Arr</TableHeaderCell>
                <TableHeaderCell>Location</TableHeaderCell>
                <TableHeaderCell>Salary</TableHeaderCell>
                <TableHeaderCell>Desired</TableHeaderCell>
                <TableHeaderCell>Posted</TableHeaderCell>
                <TableHeaderCell>Applied</TableHeaderCell>
                <TableHeaderCell>Links</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell></TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {jobsWithLinks.map((j) => (
                <tr
                  key={j.id}
                  className={
                    j.status === "appliedRejected" ||
                    j.status === "interviewedRejected"
                      ? "bg-red-400"
                      : j.status === "appliedWithdrawn" ||
                        j.status === "interviewedWithdrawn"
                      ? "bg-orange-300"
                      : j.status === "interviewing"
                      ? "bg-blue-100"
                      : j.status === "applied"
                      ? "bg-slate-100"
                      : j.status === "offerReceived"
                      ? "bg-lime-100"
                      : j.status === "offerAccepted"
                      ? "bg-green-200"
                      : "bg-inherit"
                  }
                >
                  <TableDataCell>
                    <NextLink href={`/jobs/${j.pid}`}>
                      {j.title || t.jobTitlePlaceholder}
                    </NextLink>
                  </TableDataCell>
                  <TableDataCell>
                    {j.staffingCompany
                      ? `${j.company || "?"} / ${j.staffingCompany}`
                      : j.company}
                  </TableDataCell>
                  <TableDataCell>{j.type && t.jobType[j.type]}</TableDataCell>
                  <TableDataCell>
                    {j.arrangement && t.jobArrangement[j.arrangement]}
                  </TableDataCell>
                  <TableDataCell>{j.location}</TableDataCell>
                  <TableDataCell>{j.postedSalary}</TableDataCell>
                  <TableDataCell>{j.desiredSalary}</TableDataCell>
                  <TableDataCell>{j.postedDate}</TableDataCell>
                  <TableDataCell>{j.appliedDate}</TableDataCell>
                  <TableDataCell>
                    {j.links.map((link, index) => (
                      <React.Fragment key={link.id}>
                        <NextLink href={link.url} target="_blank">
                          {link.name}
                        </NextLink>
                        {index < j.links.length - 1 && <span> | </span>}
                      </React.Fragment>
                    ))}
                  </TableDataCell>
                  <TableDataCell>{t.jobStatus[j.status]}</TableDataCell>
                  <TableDataCell className="text-center">
                    <DeleteButton
                      className="w-12"
                      onClick={() => deleteJob(j)}
                    />
                  </TableDataCell>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

type TableCellProps = {
  children?: ReactNode;
  className?: string;
};

function TableHeaderCell({ children, className }: TableCellProps) {
  return (
    <th className={`border border-gray-300 px-1 py-1 ${className ?? ""}`}>
      {children}
    </th>
  );
}

function TableDataCell({ children, className }: TableCellProps) {
  return (
    <td className={`border border-gray-300 px-1 py-1 ${className ?? ""}`}>
      {children}
    </td>
  );
}
