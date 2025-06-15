import { NextApiResponse } from "next";

export function sendError(res: NextApiResponse, status: number): void {
  res.status(status).end();
}
