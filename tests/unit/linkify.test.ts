import { describe, expect, it } from "vitest";
import { linkifyPaths } from "@/features/assistant/lib/linkify";

/**
 * The input here is model output, so these cases are about what happens when
 * the text is not the shape we asked for — not just the happy path.
 */
function hrefs(nodes: React.ReactNode[]): string[] {
  return nodes
    .filter(
      (n): n is React.ReactElement<{ href: string }> =>
        typeof n === "object" && n !== null && "props" in n,
    )
    .map((n) => n.props.href);
}

function text(nodes: React.ReactNode[]): string {
  return nodes.map((n) => (typeof n === "string" ? n : "")).join("");
}

function labelsOf(nodes: React.ReactNode[]): string[] {
  return nodes
    .filter(
      (n): n is React.ReactElement<{ children: string }> =>
        typeof n === "object" && n !== null && "props" in n,
    )
    .map((n) => n.props.children);
}

const LABELS = {
  "/products/aryabhata": "Aryabhata",
  "/contact?type=school-demo": "book a demo",
  "/contact": "contact us",
  "/approach/pillars/life-skills": "Life Skills",
};

describe("linkifyPaths", () => {
  it("links a bare product path", () => {
    expect(hrefs(linkifyPaths("See /products/aryabhata for more."))).toEqual([
      "/products/aryabhata",
    ]);
  });

  it("keeps the query string on the demo link", () => {
    expect(
      hrefs(linkifyPaths("Book at /contact?type=school-demo today")),
    ).toEqual(["/contact?type=school-demo"]);
  });

  it("leaves trailing punctuation outside the link", () => {
    const nodes = linkifyPaths("Read /approach/pillars/life-skills.");
    expect(hrefs(nodes)).toEqual(["/approach/pillars/life-skills"]);
    expect(text(nodes)).toContain(".");
  });

  it("links several paths in one answer", () => {
    expect(
      hrefs(linkifyPaths("Try /products/aahar or /products/yoga-safari now")),
    ).toEqual(["/products/aahar", "/products/yoga-safari"]);
  });

  it("does NOT link an external URL the model invented", () => {
    expect(
      hrefs(linkifyPaths("Visit https://evil.example.com/products/free")),
    ).toEqual([]);
  });

  it("does not link a path outside the known route prefixes", () => {
    expect(hrefs(linkifyPaths("Go to /admin or /api/secret"))).toEqual([]);
  });

  it("preserves the full text when nothing matches", () => {
    const answer = "We supply kits as part of a school programme.";
    expect(text(linkifyPaths(answer))).toBe(answer);
  });

  it("preserves surrounding prose around a link", () => {
    const nodes = linkifyPaths("Before /contact after");
    expect(text(nodes)).toBe("Before  after");
  });

  it("handles an empty answer", () => {
    expect(linkifyPaths("")).toEqual([]);
  });

  /* The point of the labels: a sentence should read as prose, not as a URL. */
  describe("readable link text", () => {
    it("uses the page name instead of the raw path", () => {
      const nodes = linkifyPaths("You can explore /products/aryabhata now", LABELS);
      expect(labelsOf(nodes)).toEqual(["Aryabhata"]);
      expect(hrefs(nodes)).toEqual(["/products/aryabhata"]);
    });

    it("collapses the model's 'Name (/path)' form onto the name", () => {
      const nodes = linkifyPaths(
        "Read more about Aryabhata (/products/aryabhata).",
        LABELS,
      );
      expect(labelsOf(nodes)).toEqual(["Aryabhata"]);
      expect(hrefs(nodes)).toEqual(["/products/aryabhata"]);
      /* The parenthetical must be gone, not just unlinked. */
      expect(text(nodes)).not.toContain("(");
      expect(text(nodes)).not.toContain("/products/");
    });

    it("does not double-link a path already collapsed in pass 1", () => {
      const nodes = linkifyPaths(
        "See Aryabhata (/products/aryabhata) and Life Skills (/approach/pillars/life-skills).",
        LABELS,
      );
      expect(hrefs(nodes)).toEqual([
        "/products/aryabhata",
        "/approach/pillars/life-skills",
      ]);
    });

    it("falls back to the path when there is no known name", () => {
      const nodes = linkifyPaths("Try /products/unknown-kit", LABELS);
      expect(labelsOf(nodes)).toEqual(["/products/unknown-kit"]);
    });

    it("links the model's own phrase rather than appending a duplicate label", () => {
      /* Seen in production: "...on our contact page" + the canonical label
         "contact us" rendered as "our contact pagecontact us". */
      const nodes = linkifyPaths(
        "You can reach out directly on our contact page (/contact).",
        LABELS,
      );
      expect(labelsOf(nodes)).toEqual(["our contact page"]);
      expect(hrefs(nodes)).toEqual(["/contact"]);
      expect(text(nodes)).not.toContain("contact us");
      expect(text(nodes)).not.toContain("(");
    });

    it("caps the trailing phrase at three words", () => {
      const nodes = linkifyPaths(
        "Please go and read all about the five pillars (/approach/pillars/life-skills).",
        LABELS,
      );
      expect(labelsOf(nodes)).toEqual(["the five pillars"]);
    });

    it("still refuses a path inside an external URL", () => {
      expect(
        hrefs(linkifyPaths("Visit https://evil.example.com/products/aryabhata", LABELS)),
      ).toEqual([]);
    });
  });
});
