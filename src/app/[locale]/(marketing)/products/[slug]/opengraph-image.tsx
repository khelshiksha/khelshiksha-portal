import { ImageResponse } from "next/og";
import { getProductBySlug, getProductSlugs } from "@/services/cms";
import { formatAgeRange, formatDuration, formatGroupSize } from "@/lib/utils";
import { SITE } from "@/lib/constants";

/**
 * Per-kit share card.
 *
 * Replaces the previous approach of pointing og:image at the kit's hero
 * illustration, which was an SVG — a format Facebook, WhatsApp, LinkedIn and
 * X all refuse to render, so every kit shared to a staffroom group produced a
 * blank card. This renders a real PNG.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = await getProductBySlug((await params).slug);
  return [
    {
      id: "card",
      size,
      contentType,
      alt: product ? `${product.title} — ${product.tagline}` : SITE.name,
    },
  ];
}

const INK = "#161a2b";
const PAPER = "#fdfbf6";
const BRAND = "#4d8bf0";
const ACCENT = "#f5c518";

export default async function ProductOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = await getProductBySlug((await params).slug);

  const title = product?.title ?? SITE.name;
  const tagline = product?.tagline ?? SITE.secondary;
  const specs = product
    ? [
        formatAgeRange(product.ageMin, product.ageMax),
        formatDuration(product.durationMinutes),
        formatGroupSize(product.groupSizeMin, product.groupSizeMax),
      ]
    : [];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK,
        padding: "68px 80px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            color: BRAND,
          }}
        >
          Khel
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            color: PAPER,
          }}
        >
          Shiksha
        </div>
        <div
          style={{
            display: "flex",
            marginLeft: 18,
            paddingLeft: 18,
            borderLeft: "2px solid #2b3550",
            fontSize: 22,
            color: "#8e94ac",
            letterSpacing: 3,
          }}
        >
          LEARNING KIT
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            fontSize: 86,
            fontWeight: 700,
            color: PAPER,
            lineHeight: 1.05,
            letterSpacing: -3,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#a5aac0",
            lineHeight: 1.35,
            maxWidth: 820,
          }}
        >
          {tagline}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {specs.map((spec) => (
          <div
            key={spec}
            style={{
              display: "flex",
              padding: "12px 22px",
              borderRadius: 999,
              border: "2px solid #2b3550",
              fontSize: 22,
              color: PAPER,
            }}
          >
            {spec}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            marginLeft: "auto",
            height: 6,
            width: 64,
            background: ACCENT,
            borderRadius: 999,
          }}
        />
      </div>
    </div>,
    size,
  );
}
