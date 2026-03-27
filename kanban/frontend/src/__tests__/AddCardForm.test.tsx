import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddCardForm } from "@/components/AddCardForm";

describe("AddCardForm", () => {
  it("renders title and details fields", () => {
    render(<AddCardForm columnId="col-1" onAdd={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByPlaceholderText("Card title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Details (optional)")).toBeInTheDocument();
  });

  it("submit button is disabled when title is empty", () => {
    render(<AddCardForm columnId="col-1" onAdd={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole("button", { name: /add card/i })).toBeDisabled();
  });

  it("submit button is enabled after typing a title", async () => {
    const user = userEvent.setup();
    render(<AddCardForm columnId="col-1" onAdd={vi.fn()} onCancel={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("Card title"), "My task");
    expect(screen.getByRole("button", { name: /add card/i })).toBeEnabled();
  });

  it("calls onAdd with correct args on submit", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddCardForm columnId="col-2" onAdd={onAdd} onCancel={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("Card title"), "New task");
    await user.type(screen.getByPlaceholderText("Details (optional)"), "Some details");
    await user.click(screen.getByRole("button", { name: /add card/i }));
    expect(onAdd).toHaveBeenCalledWith("col-2", "New task", "Some details");
  });

  it("does not call onAdd for a whitespace-only title", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddCardForm columnId="col-1" onAdd={onAdd} onCancel={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("Card title"), "   ");
    fireEvent.submit(screen.getByRole("button", { name: /add card/i }).closest("form")!);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<AddCardForm columnId="col-1" onAdd={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
