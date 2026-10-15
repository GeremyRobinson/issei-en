import { describe, expect, it } from "vitest";
import { checkAccess, createToken, readToken, vendorList } from "./vendor-session";

const list = vendorList("Buyer@Cafe.com:1234-5678, other@shop.com:8765 4321");

describe("vendor access", () => {
  it("reads the vendor list, ignoring case and code formatting", () => {
    expect(list.get("buyer@cafe.com")).toBe("12345678");
    expect(list.get("other@shop.com")).toBe("87654321");
  });
  it("accepts a listed email with its own code only", () => {
    expect(checkAccess(" buyer@cafe.com ", "1234 5678", list)).toBe(true);
    expect(checkAccess("buyer@cafe.com", "8765-4321", list)).toBe(false);
    expect(checkAccess("stranger@x.com", "1234-5678", list)).toBe(false);
  });
});

describe("vendor session token", () => {
  const key = "test-key";
  it("round-trips an email until it expires", () => {
    const now = Date.UTC(2026, 9, 15);
    const token = createToken("buyer@cafe.com", now, key);
    expect(readToken(token, now, key)).toBe("buyer@cafe.com");
    expect(readToken(token, now + 31 * 864e5, key)).toBeNull();
  });
  it("rejects a token that was changed or signed with another key", () => {
    const token = createToken("buyer@cafe.com", Date.now(), key);
    const [payload, mac] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ e: "evil@x.com", x: 9e9 })).toString("base64url");
    expect(readToken(`${forged}.${mac}`, Date.now(), key)).toBeNull();
    expect(readToken(token, Date.now(), "other-key")).toBeNull();
    expect(readToken(`${payload}.`, Date.now(), key)).toBeNull();
  });
});
