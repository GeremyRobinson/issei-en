import { describe, expect, it } from "vitest";
import { add, count, remove, setQty, total } from "./cart";

describe("cart", () => {
  it("adds a tea, then counts it again", () => {
    const lines = add(add([], "sei"), "sei");
    expect(lines).toEqual([{ slug: "sei", qty: 2 }]);
    expect(count(lines)).toBe(2);
  });
  it("totals retail prices", () => {
    expect(total([{ slug: "sei", qty: 2 }, { slug: "uji", qty: 1 }])).toBe(75 * 2 + 47.5);
  });
  it("removes a line when its quantity drops below one", () => {
    expect(setQty([{ slug: "sei", qty: 1 }], "sei", 0)).toEqual([]);
    expect(remove([{ slug: "sei", qty: 3 }, { slug: "kyo", qty: 1 }], "sei")).toEqual([{ slug: "kyo", qty: 1 }]);
  });
});
