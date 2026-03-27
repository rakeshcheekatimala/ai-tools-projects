import { describe, it, expect } from "vitest";
import { initialBoardState } from "@/lib/seed";

describe("initialBoardState seed data", () => {
  it("has exactly 5 columns", () => {
    expect(initialBoardState.columns.length).toBe(5);
  });

  it("all columns have unique ids", () => {
    const ids = initialBoardState.columns.map((c) => c.id);
    expect(new Set(ids).size).toBe(5);
  });

  it("all columns have non-empty titles", () => {
    initialBoardState.columns.forEach((col) => {
      expect(col.title.trim().length).toBeGreaterThan(0);
    });
  });

  it("has at least one card per column that has cards (board not empty)", () => {
    expect(initialBoardState.cards.length).toBeGreaterThan(0);
  });

  it("all cards reference a valid columnId", () => {
    const colIds = new Set(initialBoardState.columns.map((c) => c.id));
    initialBoardState.cards.forEach((card) => {
      expect(colIds.has(card.columnId)).toBe(true);
    });
  });

  it("all cards have non-empty titles", () => {
    initialBoardState.cards.forEach((card) => {
      expect(card.title.trim().length).toBeGreaterThan(0);
    });
  });

  it("all card ids are unique", () => {
    const ids = initialBoardState.cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
