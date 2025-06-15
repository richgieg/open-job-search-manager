import { NextApiResponse } from "next";

export function sendResponse(res: NextApiResponse<void>, status: number): void;

export function sendResponse<T>(
  res: NextApiResponse<T>,
  status: number,
  data: T
): void;

export function sendResponse(
  res: NextApiResponse,
  status: number,
  data?: unknown
): void {
  if (data) {
    res.status(status).json(data);
  } else {
    res.status(status).end();
  }
}
