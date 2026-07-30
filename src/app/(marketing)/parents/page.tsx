import type { Metadata } from "next";
import { AudiencePage } from "@/features/audiences/audience-page";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "For Parents",
  description:
    "Screen-free learning games your child will ask to play again, built around what they are learning at school.",
  path: "/parents",
});

export default function Page() {
  return <AudiencePage audienceKey="parents" />;
}
