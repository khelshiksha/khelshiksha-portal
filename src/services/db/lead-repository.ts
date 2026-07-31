import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { LeadInput, LeadType } from "@/features/leads/schema";
import { getPrisma, isDatabaseConfigured } from "./client";

export interface StoredLead {
  id: string;
  type: LeadType;
  name: string;
  phone: string;
  createdAt: string;
}

export interface LeadRepository {
  create(
    input: LeadInput,
    meta: { ipHash: string | null; userAgent: string | null },
  ): Promise<StoredLead>;
}

/**
 * Thrown when there is nowhere durable to put a lead. The action turns this
 * into a message offering the phone number rather than a false success —
 * losing an enquiry silently is the worst possible failure on this site.
 */
export class LeadStorageUnavailableError extends Error {
  constructor() {
    super("No durable lead store is configured");
    this.name = "LeadStorageUnavailableError";
  }
}

/* --- Postgres ----------------------------------------------------------- */

const LEAD_TYPE_MAP = {
  "school-demo": "SCHOOL_DEMO",
  "school-enquiry": "SCHOOL_ENQUIRY",
  teacher: "TEACHER",
  parent: "PARENT",
  government: "GOVERNMENT",
  ngo: "NGO",
  "product-enquiry": "PRODUCT_ENQUIRY",
  general: "GENERAL",
} as const;

const SLOT_MAP = {
  morning: "MORNING",
  afternoon: "AFTERNOON",
  either: "EITHER",
} as const;

class PostgresLeadRepository implements LeadRepository {
  async create(
    input: LeadInput,
    meta: { ipHash: string | null; userAgent: string | null },
  ): Promise<StoredLead> {
    const prisma = getPrisma();

    const lead = await prisma.lead.create({
      data: {
        type: LEAD_TYPE_MAP[input.type],
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        organisation: input.organisation || null,
        district: input.district || null,
        role: input.role || null,
        message: input.message || null,
        sanityProductId: input.productId || null,
        sourcePath: input.sourcePath || null,
        preferredSlot: input.preferredSlot
          ? SLOT_MAP[input.preferredSlot]
          : null,
        consentMarketing: input.consentMarketing,
        /* Consent is only timestamped when it was actually given. */
        consentAt: input.consentMarketing ? new Date() : null,
        ipHash: meta.ipHash,
        userAgent: meta.userAgent,

        /* A demo request creates its booking in the same transaction, so a
           lead of that type can never exist without one. */
        ...(input.type === "school-demo"
          ? {
              booking: {
                create: {
                  preferredSlot: input.preferredSlot
                    ? SLOT_MAP[input.preferredSlot]
                    : null,
                },
              },
            }
          : {}),
      },
      select: { id: true, type: true, name: true, phone: true, createdAt: true },
    });

    return {
      id: lead.id,
      type: input.type,
      name: lead.name,
      phone: lead.phone,
      createdAt: lead.createdAt.toISOString(),
    };
  }
}

/* --- File (development / E2E) ------------------------------------------- */

/**
 * Appends to .data/leads.jsonl.
 *
 * Exists so the whole submission path is real and testable before a database
 * is provisioned. NOT a production store: a serverless filesystem is
 * ephemeral, so this would silently lose enquiries. `getLeadRepository`
 * refuses to hand it out in production unless explicitly asked.
 */
class FileLeadRepository implements LeadRepository {
  private readonly file = path.join(process.cwd(), ".data", "leads.jsonl");

  async create(
    input: LeadInput,
    meta: { ipHash: string | null; userAgent: string | null },
  ): Promise<StoredLead> {
    const lead = {
      ...input,
      ...meta,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    await mkdir(path.dirname(this.file), { recursive: true });
    await appendFile(this.file, `${JSON.stringify(lead)}\n`, "utf8");

    console.info(
      `[lead] ${lead.type} from ${lead.name} (${lead.phone}) — written to .data/leads.jsonl`,
    );

    return {
      id: lead.id,
      type: input.type,
      name: input.name,
      phone: input.phone,
      createdAt: lead.createdAt,
    };
  }
}

/* --- Selection ---------------------------------------------------------- */

export function getLeadRepository(): LeadRepository {
  /* A configured database always wins. */
  if (isDatabaseConfigured()) {
    return new PostgresLeadRepository();
  }

  /* Explicit opt-in to the file store — needed so E2E can exercise the real
     success path against a production build, and so a staging box can run
     without a database.

     Deliberately opt-in rather than a fallback: as a fallback, a production
     deploy with a mistyped connection string would silently write enquiries
     to a disk that vanishes on the next deploy. The failure has to be loud. */
  if (process.env.LEAD_STORE === "file") {
    return new FileLeadRepository();
  }

  if (process.env.NODE_ENV === "production") {
    throw new LeadStorageUnavailableError();
  }

  return new FileLeadRepository();
}
