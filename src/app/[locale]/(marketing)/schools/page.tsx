import type { Metadata } from "next";
import { AudiencePage } from "@/features/audiences/audience-page";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "For Schools",
  description:
    "A complete learning ecosystem for your Vidyalaya — kits, a Game Corner and teacher training, installed and running inside one term.",
  path: "/schools",
});

export default function Page() {
  return <AudiencePage audienceKey="schools" />;
}
