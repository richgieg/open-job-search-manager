import { type EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/api";
import { makeApiHandler } from "@/lib";

function stringOrFirstString(item: string | string[] | undefined) {
  return Array.isArray(item) ? item[0] : item;
}

export default makeApiHandler({
  GET: async (req, res) => {
    const queryParams = req.query;
    const token_hash = stringOrFirstString(queryParams.token_hash);
    const type = stringOrFirstString(queryParams.type);

    let next = "/error";

    if (token_hash && type) {
      const supabase = createClient(req, res);
      const { error } = await supabase.auth.verifyOtp({
        type: type as EmailOtpType,
        token_hash,
      });
      if (error) {
        console.error(error);
      } else {
        next = stringOrFirstString(queryParams.next) || "/";
      }
    }

    res.redirect(next);
  },
});
