import z from "zod";

export const adminCommonQueryStringSchema = z.object({
  sortBy: z.string().optional().default("id"),
  sortOrder: z.string().optional().default("asc"),
  rangeFirst: z.coerce.number().optional().default(0),
  rangeLast: z.coerce.number().optional().default(10000),
  filter: z.string(),
});

export const adminCommonListSchema = z.object({
  total: z.number(),
});