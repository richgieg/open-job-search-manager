import { z } from "zod";

export const pidSchema = z.string().uuid();
