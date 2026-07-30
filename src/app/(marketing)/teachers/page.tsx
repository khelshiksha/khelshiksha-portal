import type { Metadata } from "next";
import { AudiencePage } from "@/features/audiences/audience-page";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "For Teachers",
  description:
    "Curriculum-mapped classroom games with facilitation guides, difficulty variations and outcomes you can actually observe.",
  path: "/teachers",
});

export default function Page() {
  return <AudiencePage audienceKey="teachers" />;
}
