import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

/**
 * The default social share card for every route.
 *
 * Next resolves this file for the root segment and every segment below it
 * that does not define its own, so one file covers the whole site and
 * /products/[slug] can still override it with a per-kit card.
 *
 * Generated rather than a checked-in PNG for two reasons: the copy stays in
 * sync with SITE, and there is no binary in the repo that someone has to
 * remember to re-export when the wordmark changes.
 *
 * Deliberately no webfont. Loading Fraunces here would mean fetching a font
 * file at build time for every card, and a network hiccup would fail the
 * build for a decorative gain. The card carries the brand through colour and
 * composition instead.
 */
export const alt = `${SITE.name} — ${SITE.secondary}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#161a2b";
const PAPER = "#fdfbf6";
const BRAND = "#4d8bf0";
const ACCENT = "#f5c518";

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK,
        padding: "72px 80px",
        position: "relative",
      }}
    >
      {/* Echoes the play-shapes in the hero without shipping the artwork. */}
      <div
        style={{
          position: "absolute",
          top: -150,
          right: -110,
          width: 520,
          height: 520,
          borderRadius: 999,
          background: "#1f2b4a",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -170,
          right: 180,
          width: 340,
          height: 340,
          borderRadius: 999,
          background: "#23305200",
          border: `10px solid ${BRAND}33`,
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 700,
            color: BRAND,
          }}
        >
          Khel
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 700,
            color: PAPER,
          }}
        >
          Shiksha
        </div>
        <div
          style={{
            display: "flex",
            width: 9,
            height: 9,
            borderRadius: 999,
            background: ACCENT,
            marginTop: 14,
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div
          style={{
            display: "flex",
            fontSize: 74,
            fontWeight: 700,
            color: PAPER,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 880,
          }}
        >
          Learning through play.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#a5aac0",
            lineHeight: 1.4,
            maxWidth: 760,
          }}
        >
          Gamified experiential learning kits, a Game Corner for the classroom,
          and teacher training for Vidyalayas across India.
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            height: 6,
            width: 72,
            background: ACCENT,
            borderRadius: 999,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            color: PAPER,
            letterSpacing: 4,
          }}
        >
          BUILD · PLAY · LEARN
        </div>
      </div>
    </div>,
    size,
  );
}
