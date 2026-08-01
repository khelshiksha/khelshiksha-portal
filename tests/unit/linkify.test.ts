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
});
