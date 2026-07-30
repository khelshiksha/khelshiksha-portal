import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { LeadInput } from "@/features/leads/schema";

export interface StoredLead extends LeadInput {
  id: string;
  ipHash: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface LeadRepository {
  create(
    input: LeadInput,
    meta: { ipHash: string | null; userAgent: string | null },
  ): Promise<StoredLead>;
}

/**
 * Development adapter — appends to .data/leads.jsonl.
 *
 * Exists so the whole submission path (validate → rate limit → persist →
 * confirm) is real and testable before a database is provisioned. It is NOT a
 * production store: a serverless filesystem is ephemeral, so this would
 * silently lose enquiries if it ever ran in production. `getLeadRepository`
 * below refuses to hand it out there for exactly that reason.
 */
class FileLeadRepository implements LeadRepository {
  private readonly file = path.join(process.cwd(), ".data", "leads.jsonl");

  async create(
    input: LeadInput,
    meta: { ipHash: string | null; userAgent: string | null },
  ): Promise<StoredLead> {
    const lead: StoredLead = {
      ...input,
      id: crypto.randomUUID(),
      ipHash: meta.ipHash,
      userAgent: meta.userAgent,
      createdAt: new Date().toISOString(),
    };

    await mkdir(path.dirname(this.file), { recursive: true });
    await appendFile(this.file, `${JSON.stringify(lead)}\n`, "utf8");

    console.info(
      `[lead] ${lead.type} from ${lead.name} (${lead.phone}) — written to .data/leads.jsonl`,
    );

    return lead;
  }
}

/**
 * Thrown when there is nowhere durable to put a lead. The action turns this
 * into a message offering the phone number, rather than a false success —
 * losing an enquiry silently is the worst possible failure on this site.
 */
export class LeadStorageUnavailableError extends Error {
  constructor() {
    super("No durable lead store is configured");
    this.name = "LeadStorageUnavailableError";
  }
}

export function getLeadRepository(): LeadRepository {
  /* When DATABASE_URL exists, this returns the Prisma-backed repository
     (schema already defined in docs/architecture/06-database-schema.md).
     Until then: file in development, hard failure in production. */
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    throw new LeadStorageUnavailableError();
  }
  return new FileLeadRepository();
}
