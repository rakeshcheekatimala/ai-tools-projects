import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KanbanCard } from "@/components/KanbanCard";
import { Card } from "@/lib/types";

const card: Card = {
  id: "card-1",
  title: "Test card",
  details: "Test details",
  columnId: "col-1",
};

describe("KanbanCard", () => {
  it("renders title and details", () => {
    render(<KanbanCard card={card} onDelete={vi.fn()} />);
    expect(screen.getByText("Test card")).toBeInTheDocument();
    expect(screen.getByText("Test details")).toBeInTheDocument();
  });

  it("calls onDelete with correct cardId when delete button clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<KanbanCard card={card} onDelete={onDelete} />);
    await user.click(screen.getByRole("button", { name: /delete card/i }));
    expect(onDelete).toHaveBeenCalledWith("card-1");
  });

  it("renders without details gracefully", () => {
    const noDetails: Card = { ...card, details: "" };
    render(<KanbanCard card={noDetails} onDelete={vi.fn()} />);
    expect(screen.getByText("Test card")).toBeInTheDocument();
  });
});
