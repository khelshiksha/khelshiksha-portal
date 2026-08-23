import type { Metadata } from "next";
import { AudiencePage } from "@/features/audiences/audience-page";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "For Corporate & CSR",
  description:
    "Partner for grassroots educational impact. Experiential learning tools aligned to Mission LiFE, Fit India and Eat Right India, with adaptive resources for CWSN and periodic progress reporting.",
  path: "/corporate",
});

export default function Page() {
  return <AudiencePage audienceKey="corporate" />;
}
