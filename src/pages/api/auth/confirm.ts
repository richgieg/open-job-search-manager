import { createClient } from "@/lib/supabase/api";
import { makeApiHandler } from "@/lib";

function stringOrFirstString(item: string | string[] | undefined) {
  return Array.isArray(item) ? item[0] : item;
}

export default makeApiHandler({
  GET: async (req, res) => {
    const queryParams = req.query;
    const token_hash = stringOrFirstString(queryParams.token_hash);
    let next = "/error";
    if (token_hash) {
      const supabase = createClient(req, res);
      const { error } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash,
      });
      if (error) {
        console.error(error);
      } else {
        next = "/";
      }
    }
    res.redirect(next);
  },
});
