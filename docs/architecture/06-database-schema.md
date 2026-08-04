# 6. Database Schema (PostgreSQL + Prisma)

## What lives here — and what does not

Postgres owns **transactional and user-generated data only**. Products, pages, blog posts,
testimonials and case studies live in Sanity ([07-cms-schema.md](07-cms-schema.md)) and are
**never mirrored** into a table.

Where a row needs to reference CMS content it stores a **string ID** (`sanityProductId`) and
resolves it at read time. This costs one extra fetch in analytics queries and saves an entire
class of sync bugs. That trade is the right way round.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL") // migrations bypass the pooler
}
```

---

## Lead capture — the commercial core

```prisma
enum LeadType {
  SCHOOL_DEMO
  SCHOOL_ENQUIRY
  TEACHER_ENQUIRY
  PARENT_ENQUIRY
  GOVT_PROPOSAL
  NGO_PARTNERSHIP
  GENERAL
  CAREERS
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  PROPOSAL_SENT
  WON
  LOST
  SPAM
}

model Lead {
  id        String     @id @default(cuid())
  type      LeadType
  status    LeadStatus @default(NEW)

  // Identity — only `name` and one contact channel are ever required.
  name         String
  email        String?
  phone        String?
  organisation String?
  role         String?

  // Geography. District matters more than city for government segmentation.
  district String?
  state    String?  @default("Gujarat")
  pincode  String?

  // Qualification — all optional. Asking a parent for a budget loses the parent.
  studentCount   Int?
  gradeRange     String?
  timeline       String?
  budgetBand     String?
  message        String?  @db.Text

  // Interest signals. Strings, not FKs — these point at Sanity documents.
  sanityProductId String?
  pillarInterest  String[] @default([])

  // Attribution — how the enquiry actually happened.
  sourcePath  String?
  referrer    String?
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  utmContent  String?
  utmTerm     String?

  // Consent. Explicit, timestamped, and never defaulted to true.
  consentMarketing Boolean   @default(false)
  consentAt        DateTime?

  // Anti-abuse
  ipHash    String?  // SHA-256(ip + salt) — rate limiting without storing a PII IP
  userAgent String?
  spamScore Float?

  assignedTo String?
  notes      LeadNote[]
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  @@index([type, status, createdAt(sort: Desc)])
  @@index([email])
  @@index([district])
  @@index([createdAt(sort: Desc)])
  @@map("leads")
}

model LeadNote {
  id        String   @id @default(cuid())
  leadId    String
  lead      Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)
  author    String
  body      String   @db.Text
  createdAt DateTime @default(now())

  @@index([leadId, createdAt(sort: Desc)])
  @@map("lead_notes")
}
```

**Design note — why one `Lead` table and not five.** A parent enquiry and a government proposal
share ~80% of their fields and 100% of their lifecycle. Splitting them means five near-identical
tables and a union query on every dashboard view. `type` plus nullable qualification fields is
the correct normalisation here.

---

## Demo bookings

```prisma
enum BookingStatus {
  REQUESTED
  CONFIRMED
  RESCHEDULED
  COMPLETED
  NO_SHOW
  CANCELLED
}

enum BookingMode {
  ON_SITE
  VIDEO_CALL
  PHONE
}

model DemoBooking {
  id     String        @id @default(cuid())
  leadId String?
  status BookingStatus @default(REQUESTED)
  mode   BookingMode   @default(ON_SITE)

  contactName  String
  phone        String
  email        String?
  schoolName   String
  district     String?

  preferredDate DateTime?
  preferredSlot String?    // "morning" | "afternoon" — not a timestamp; schools think in slots
  confirmedAt   DateTime?
  scheduledFor  DateTime?

  attendedBy String?
  outcome    String?  @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([status, scheduledFor])
  @@map("demo_bookings")
}
```

---

## Resource downloads & newsletter

```prisma
model ResourceDownload {
  id               String  @id @default(cuid())
  sanityResourceId String
  resourceTitle    String  // denormalised so reports survive a CMS deletion

  email    String
  name     String?
  role     String?  // "teacher" | "parent" | "school-admin"
  grade    String?
  school   String?

  sourcePath String?
  ipHash     String?
  userId     String?
  user       User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  createdAt DateTime @default(now())

  @@index([sanityResourceId, createdAt(sort: Desc)])
  @@index([email])
  @@map("resource_downloads")
}

enum SubscriberStatus {
  PENDING      // double opt-in sent, not yet confirmed
  SUBSCRIBED
  UNSUBSCRIBED
  BOUNCED
}

model NewsletterSubscriber {
  id       String           @id @default(cuid())
  email    String           @unique
  name     String?
  status   SubscriberStatus @default(PENDING)
  audience String[]         @default([]) // teacher | parent | school | govt

  confirmToken     String?   @unique
  confirmedAt      DateTime?
  unsubscribeToken String    @unique @default(cuid())
  unsubscribedAt   DateTime?

  sourcePath String?
  createdAt  DateTime @default(now())

  @@index([status])
  @@map("newsletter_subscribers")
}
```

`unsubscribeToken` is generated at creation, not on demand — every email can carry a working
one-click unsubscribe link, which is now a deliverability requirement, not a nicety.

---

## Auth (Auth.js v5 + Prisma adapter)

Standard adapter tables, plus the domain fields that justified choosing Auth.js over Clerk in
the first place ([D2](00-overview.md#d2--authjs-v5-with-the-prisma-adapter-not-clerk)).

```prisma
enum UserRole {
  TEACHER
  SCHOOL_ADMIN
  PARENT
  NGO
  GOVT
  STAFF
  ADMIN
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(TEACHER)

  // Domain profile — the reason this data lives in our database
  organisation String?
  district     String?
  gradesTaught String[] @default([])
  subjects     String[] @default([])

  accounts  Account[]
  sessions  Session[]
  downloads ResourceDownload[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  lastSeenAt  DateTime?

  @@index([role])
  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

---

## Search & AI telemetry

Not analytics for its own sake — this is the data that tells us what the catalogue is missing
and whether the AI features are worth their cost.

```prisma
model SearchQuery {
  id            String   @id @default(cuid())
  query         String
  normalised    String   // lowercased, trimmed — group-by key
  resultCount   Int
  clickedId     String?  // Sanity ID of the result opened, if any
  clickedRank   Int?
  usedAiParsing Boolean  @default(false)
  sessionHash   String?
  createdAt     DateTime @default(now())

  @@index([normalised])
  @@index([createdAt(sort: Desc)])
  @@index([resultCount]) // zero-result queries = catalogue gaps, the highest-value report
  @@map("search_queries")
}

enum AiFeature {
  PRODUCT_ADVISOR
  LESSON_PLANNER
  ACTIVITY_GENERATOR
  PARENT_GUIDE
  CHATBOT
  SEARCH_INTENT
}

model AiConversation {
  id        String      @id @default(cuid())
  feature   AiFeature
  userId    String?
  sessionHash String?

  messages  Json        // [{ role, content, at }] — capped at 40 turns
  model     String      // e.g. "claude-opus-5"

  inputTokens      Int @default(0)
  outputTokens     Int @default(0)
  cacheReadTokens  Int @default(0)
  cacheWriteTokens Int @default(0)
  latencyMs        Int?

  wasHelpful     Boolean? // explicit thumbs
  refusalReason  String?  // stop_reason == "refusal" → category
  errorCode      String?

  createdAt DateTime @default(now())

  @@index([feature, createdAt(sort: Desc)])
  @@map("ai_conversations")
}
```

Token columns are separated (input / output / cache-read / cache-write) because a single
`totalTokens` number makes it impossible to tell whether prompt caching is actually working.
If `cacheReadTokens` is ~0 across requests, the cached prefix has a silent invalidator in it.

---

## Operational

```prisma
model FormSubmissionLog {
  id        String   @id @default(cuid())
  formKey   String
  success   Boolean
  errorCode String?
  ipHash    String?
  createdAt DateTime @default(now())

  @@index([formKey, createdAt(sort: Desc)])
  @@map("form_submission_logs")
}

model RateLimitBucket {
  key       String   @id  // "lead:<ipHash>" | "ai:<sessionHash>"
  count     Int      @default(0)
  expiresAt DateTime

  @@index([expiresAt])
  @@map("rate_limit_buckets")
}
```

`RateLimitBucket` is the fallback. Primary rate limiting is Upstash Redis at the edge — this
table catches what slips past and gives a durable audit trail.

---

## Privacy & retention

| Concern          | Decision                                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| IP addresses     | Never stored raw. `SHA-256(ip + APP_SALT)` only, for rate limiting and dedup.                                                                                                                    |
| Consent          | Explicit boolean + timestamp. Never pre-checked, never inferred from form submission.                                                                                                            |
| Retention        | `SearchQuery` and `FormSubmissionLog` purged at 180 days by a cron. `Lead` retained until the business deletes it.                                                                               |
| Deletion         | A `deleteUserData(email)` service removes/anonymises across `Lead`, `ResourceDownload`, `NewsletterSubscriber`, `User`. Built in phase 2, not retrofitted.                                       |
| AI conversations | `messages` JSON stores the user's text. Not linked to a `User` unless authenticated. Purged at 90 days.                                                                                          |
| Children's data  | **The site never collects data about a child.** Parent forms ask for the child's _age band_ and _interests_ — never name, school, or photo. This is a hard product constraint, not a preference. |

---

## Migrations & environments

- `prisma migrate dev` locally; `prisma migrate deploy` in the Vercel build step.
- **Never `db push` against production.** Every schema change is a reviewed migration file.
- Three databases: local (Docker Postgres), preview (Neon branch per PR), production (Neon or
  Supabase with PITR enabled).
- `directUrl` is set so migrations bypass the connection pooler — otherwise advisory locks
  fail intermittently and you get a half-applied migration, which is a bad afternoon.
