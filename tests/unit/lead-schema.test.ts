import { describe, expect, it } from "vitest";
import { leadSchema, schoolDemoSchema } from "@/features/leads/schema";

const valid = {
  type: "school-demo",
  name: "Meera Shah",
  phone: "9779873333",
  organisation: "Shree Vidyalaya",
};

describe("leadSchema — phone", () => {
  it.each([
    ["9779873333", "9779873333"],
    ["+91 97798 73333", "9779873333"],
    ["+919779873333", "9779873333"],
    ["97798-73333", "9779873333"],
    ["(97798) 73333", "9779873333"],
  ])("normalises %s", (input, expected) => {
    const result = leadSchema.safeParse({ ...valid, phone: input });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.phone).toBe(expected);
  });

  it.each([
    ["123", "too short"],
    ["1234567890", "does not start 6-9"],
    ["5779873333", "starts with 5"],
    ["97798733331", "eleven digits"],
    ["", "empty"],
  ])("rejects %s (%s)", (input) => {
    expect(leadSchema.safeParse({ ...valid, phone: input }).success).toBe(
      false,
    );
  });

  it("tells the user how to fix it, rather than just 'invalid'", () => {
    const result = leadSchema.safeParse({ ...valid, phone: "123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.phone?.[0]).toBe(
        "Enter a 10-digit mobile number",
      );
    }
  });
});

describe("leadSchema — consent", () => {
  it("defaults to false when the box is not ticked", () => {
    const result = leadSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.consentMarketing).toBe(false);
  });

  it("is true only when explicitly submitted", () => {
    const result = leadSchema.safeParse({ ...valid, consentMarketing: "true" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.consentMarketing).toBe(true);
  });
});

describe("leadSchema — optional fields", () => {
  it("accepts a lead with only name, phone and type", () => {
    expect(
      leadSchema.safeParse({
        type: "parent",
        name: "Priya",
        phone: "9876543210",
      }).success,
    ).toBe(true);
  });

  it("accepts an empty email string without complaining", () => {
    expect(leadSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
  });

  it("rejects a malformed email when one is given", () => {
    expect(
      leadSchema.safeParse({ ...valid, email: "not-an-email" }).success,
    ).toBe(false);
  });
});

describe("schoolDemoSchema", () => {
  it("additionally requires the school name", () => {
    const result = schoolDemoSchema.safeParse({ ...valid, organisation: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.organisation?.[0]).toBe(
        "Please enter your school's name",
      );
    }
  });
});
