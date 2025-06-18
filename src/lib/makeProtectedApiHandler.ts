import { NextApiRequest, NextApiResponse } from "next";
import { sendError } from "./sendError";
import { getAuthenticatedUser } from "./supabase/api";
import { User } from "@supabase/supabase-js";

type Method = "GET" | "POST" | "PUT" | "DELETE";

type MethodHandler = (
  user: User,
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
      return methodHandler(user, req, res);
    } catch {
      return sendError(res, 500);
    }
  };
}
