import { createClient } from "@/lib/supabase/api";
import { makeApiHandler, sendError } from "@/lib";
import { z } from "zod";

const querySchema = z.object({
  token_hash: z.string(),
});

export default makeApiHandler({
  GET: async (req, res) => {
    const parseResult = querySchema.safeParse(req.query);
    if (!parseResult.success) {
      return sendError(res, 400);
    }
    const { token_hash } = parseResult.data;
    const supabase = createClient(req, res);
    const { error } = await supabase.auth.verifyOtp({
      type: "email",
      token_hash,
    });
    if (error) {
      console.error(error);
      res.redirect("/error");
      return;
    }
    res.redirect("/");
  },
});
