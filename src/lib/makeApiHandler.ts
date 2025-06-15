import { NextApiRequest, NextApiResponse } from "next";
import { sendError } from "./sendError";

type Method = "GET" | "POST" | "PUT" | "DELETE";

type MethodHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => void | Promise<void>;

export function makeApiHandler(
  methodHandlers: Partial<Record<Method, MethodHandler>>
) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const methodHandler = (
      methodHandlers as Partial<Record<string, MethodHandler>>
    )[req.method ?? ""];
    if (methodHandler) {
      try {
        return methodHandler(req, res);
      } catch {
        return sendError(res, 500);
      }
    }
    res.setHeader("Allow", Object.keys(methodHandlers).join(", "));
    return sendError(res, 405);
  };
}
