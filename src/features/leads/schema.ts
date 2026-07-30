import { z } from "zod";

/**
 * ONE zod schema, imported by both the client form and the Server Action.
 *
 * Client-side validation is UX; the server-side parse is the actual check.
 * They cannot drift because there is a single definition — this is the whole
 * reason the schema lives in its own module rather than inside either one.
 */

export const LEAD_TYPES = [
  "school-demo",
  "school-enquiry",
  "teacher",
  "parent",
  "government",
  "ngo",
  "product-enquiry",
  "general",
] as const;

export type LeadType = (typeof LEAD_TYPES)[number];

export function isLeadType(value: string | undefined): value is LeadType {
  return Boolean(value) && (LEAD_TYPES as readonly string[]).includes(value!);
}

/** Indian mobile: 10 digits starting 6–9, tolerant of +91, spaces and dashes. */
const phoneField = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-()]/g, "").replace(/^(\+?91)/, ""))
  .refine((v) => /^[6-9]\d{9}$/.test(v), {
    message: "Enter a 10-digit mobile number",
  });

export const leadSchema = z.object({
  type: z.enum(LEAD_TYPES),

  name: z.string().trim().min(2, "Please enter your name").max(120),

  phone: phoneField,

  email: z
    .string()
    .trim()
    .max(200)
    .email("Enter an email address like name@school.edu.in")
    .optional()
    .or(z.literal("")),

  organisation: z.string().trim().max(200).optional().or(z.literal("")),
  district: z.string().trim().max(120).optional().or(z.literal("")),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  preferredSlot: z.enum(["morning", "afternoon", "either"]).optional(),

  message: z.string().trim().max(2000).optional().or(z.literal("")),

  /** Sanity document id of the kit being enquired about, when applicable. */
  productId: z.string().trim().max(120).optional().or(z.literal("")),

  /** Never pre-checked, never inferred from submission. */
  consentMarketing: z.coerce.boolean().default(false),

  /* Attribution — hidden fields, not user input. */
  sourcePath: z.string().max(300).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** A school demo additionally requires the school name. */
export const schoolDemoSchema = leadSchema.extend({
  organisation: z.string().trim().min(2, "Please enter your school's name").max(200),
});

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
