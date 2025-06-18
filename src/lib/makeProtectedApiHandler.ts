import { NextApiRequest, NextApiResponse } from "next";
import { sendError } from "./sendError";
import { getAuthenticatedUser } from "./supabase/api";

type Method = "GET" | "POST" | "PUT" | "DELETE";

type MethodHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => void | Promise<void>;

export function makeProtectedApiHandler(
  methodHandlers: Partial<Record<Method, MethodHandler>>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const methodHandler = (
      methodHandlers as Partial<Record<string, MethodHandler>>
    )[req.method ?? ""];
    if (!methodHandler) {
      res.setHeader("Allow", Object.keys(methodHandlers).join(", "));
      return sendError(res, 405);
    }
    const user = await getAuthenticatedUser(req, res);
    if (!user) {
      return sendError(res, 401);
    }
    try {
      return methodHandler(req, res);
    } catch {
      return sendError(res, 500);
    }
  };
}
