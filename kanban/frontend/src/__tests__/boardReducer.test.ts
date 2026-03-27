import { describe, it, expect } from "vitest";
import { boardReducer } from "@/lib/boardReducer";
import { BoardState } from "@/lib/types";

const baseState: BoardState = {
  columns: [
    { id: "col-1", title: "Backlog" },
    { id: "col-2", title: "To Do" },
    { id: "col-3", title: "Done" },
  ],
  cards: [
    { id: "card-1", title: "Task A", details: "detail a", columnId: "col-1" },
    { id: "card-2", title: "Task B", details: "detail b", columnId: "col-1" },
    { id: "card-3", title: "Task C", details: "detail c", columnId: "col-2" },
  ],
};

describe("boardReducer - RENAME_COLUMN", () => {
  it("renames only the targeted column", () => {
    const next = boardReducer(baseState, {
      type: "RENAME_COLUMN",
      columnId: "col-1",
      title: "New Name",
    });
    expect(next.columns.find((c) => c.id === "col-1")?.title).toBe("New Name");
    expect(next.columns.find((c) => c.id === "col-2")?.title).toBe("To Do");
    expect(next.columns.find((c) => c.id === "col-3")?.title).toBe("Done");
  });

  it("does not change other state slices", () => {
    const next = boardReducer(baseState, {
      type: "RENAME_COLUMN",
      columnId: "col-1",
      title: "New Name",
    });
    expect(next.cards).toEqual(baseState.cards);
    expect(next.columns.length).toBe(baseState.columns.length);
  });

  it("returns same state reference for unknown columnId", () => {
    const next = boardReducer(baseState, {
      type: "RENAME_COLUMN",
      columnId: "col-999",
      title: "Ghost",
    });
    expect(next.columns).toEqual(baseState.columns);
  });
});

describe("boardReducer - ADD_CARD", () => {
  it("inserts card into the correct column", () => {
    const next = boardReducer(baseState, {
      type: "ADD_CARD",
      columnId: "col-2",
      title: "New Card",
      details: "some details",
    });
    const added = next.cards.find((c) => c.title === "New Card");
    expect(added).toBeDefined();
    expect(added?.columnId).toBe("col-2");
    expect(added?.details).toBe("some details");
  });

  it("generates a unique id", () => {
    const next1 = boardReducer(baseState, {
      type: "ADD_CARD",
      columnId: "col-1",
      title: "Card X",
      details: "",
    });
    const next2 = boardReducer(baseState, {
      type: "ADD_CARD",
      columnId: "col-1",
      title: "Card Y",
      details: "",
    });
    const ids = next1.cards.map((c) => c.id);
    const ids2 = next2.cards.map((c) => c.id);
    const newId1 = ids.find((id) => !baseState.cards.map((c) => c.id).includes(id));
    const newId2 = ids2.find((id) => !baseState.cards.map((c) => c.id).includes(id));
    expect(newId1).toBeDefined();
    expect(newId2).toBeDefined();
  });

  it("trims whitespace from title and details", () => {
    const next = boardReducer(baseState, {
      type: "ADD_CARD",
      columnId: "col-1",
      title: "  Trimmed  ",
      details: "  details  ",
    });
    const added = next.cards.find((c) => c.title === "Trimmed");
    expect(added).toBeDefined();
    expect(added?.details).toBe("details");
  });

  it("does not mutate columns or other cards", () => {
    const next = boardReducer(baseState, {
      type: "ADD_CARD",
      columnId: "col-1",
      title: "Extra",
      details: "",
    });
    expect(next.columns).toEqual(baseState.columns);
    expect(next.cards.length).toBe(baseState.cards.length + 1);
  });
});

describe("boardReducer - DELETE_CARD", () => {
  it("removes only the targeted card", () => {
    const next = boardReducer(baseState, { type: "DELETE_CARD", cardId: "card-2" });
    expect(next.cards.find((c) => c.id === "card-2")).toBeUndefined();
    expect(next.cards.length).toBe(baseState.cards.length - 1);
    expect(next.cards.find((c) => c.id === "card-1")).toBeDefined();
    expect(next.cards.find((c) => c.id === "card-3")).toBeDefined();
  });

  it("is a no-op for unknown cardId", () => {
    const next = boardReducer(baseState, { type: "DELETE_CARD", cardId: "card-999" });
    expect(next.cards).toEqual(baseState.cards);
  });

  it("does not affect columns", () => {
    const next = boardReducer(baseState, { type: "DELETE_CARD", cardId: "card-1" });
    expect(next.columns).toEqual(baseState.columns);
  });
});

describe("boardReducer - MOVE_CARD", () => {
  it("moves a card to a different column at a given index", () => {
    const next = boardReducer(baseState, {
      type: "MOVE_CARD",
      cardId: "card-1",
      toColumnId: "col-2",
      toIndex: 0,
    });
    const movedCard = next.cards.find((c) => c.id === "card-1");
    expect(movedCard?.columnId).toBe("col-2");
  });

  it("does not change card count", () => {
    const next = boardReducer(baseState, {
      type: "MOVE_CARD",
      cardId: "card-1",
      toColumnId: "col-3",
      toIndex: 0,
    });
    expect(next.cards.length).toBe(baseState.cards.length);
  });

  it("is a no-op for unknown cardId", () => {
    const next = boardReducer(baseState, {
      type: "MOVE_CARD",
      cardId: "card-999",
      toColumnId: "col-2",
      toIndex: 0,
    });
    expect(next.cards).toEqual(baseState.cards);
  });

  it("clamps toIndex to valid range", () => {
    const next = boardReducer(baseState, {
      type: "MOVE_CARD",
      cardId: "card-1",
      toColumnId: "col-2",
      toIndex: 999,
    });
    const movedCard = next.cards.find((c) => c.id === "card-1");
    expect(movedCard?.columnId).toBe("col-2");
  });

  it("preserves all other cards unchanged", () => {
    const next = boardReducer(baseState, {
      type: "MOVE_CARD",
      cardId: "card-1",
      toColumnId: "col-2",
      toIndex: 0,
    });
    const card2 = next.cards.find((c) => c.id === "card-2");
    const card3 = next.cards.find((c) => c.id === "card-3");
    expect(card2?.columnId).toBe("col-1");
    expect(card3?.columnId).toBe("col-2");
  });
});
