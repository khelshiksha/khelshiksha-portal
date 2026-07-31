-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('SCHOOL_DEMO', 'SCHOOL_ENQUIRY', 'TEACHER', 'PARENT', 'GOVERNMENT', 'NGO', 'PRODUCT_ENQUIRY', 'GENERAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST', 'SPAM');

-- CreateEnum
CREATE TYPE "PreferredSlot" AS ENUM ('MORNING', 'AFTERNOON', 'EITHER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'NO_SHOW', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BookingMode" AS ENUM ('ON_SITE', 'VIDEO_CALL', 'PHONE');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "type" "LeadType" NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "organisation" TEXT,
    "role" TEXT,
    "district" TEXT,
    "state" TEXT DEFAULT 'Gujarat',
    "preferredSlot" "PreferredSlot",
    "message" TEXT,
    "sanityProductId" TEXT,
    "sourcePath" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "consentMarketing" BOOLEAN NOT NULL DEFAULT false,
    "consentAt" TIMESTAMP(3),
    "ipHash" TEXT,
    "userAgent" TEXT,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_notes" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_bookings" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'REQUESTED',
    "mode" "BookingMode" NOT NULL DEFAULT 'ON_SITE',
    "preferredSlot" "PreferredSlot",
    "scheduledFor" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "attendedBy" TEXT,
    "outcome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit_buckets" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "leads_type_status_createdAt_idx" ON "leads"("type", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_district_idx" ON "leads"("district");

-- CreateIndex
CREATE INDEX "lead_notes_leadId_createdAt_idx" ON "lead_notes"("leadId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "demo_bookings_leadId_key" ON "demo_bookings"("leadId");

-- CreateIndex
CREATE INDEX "demo_bookings_status_scheduledFor_idx" ON "demo_bookings"("status", "scheduledFor");

-- CreateIndex
CREATE INDEX "rate_limit_buckets_expiresAt_idx" ON "rate_limit_buckets"("expiresAt");

-- AddForeignKey
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_bookings" ADD CONSTRAINT "demo_bookings_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

