import { test, expect } from "@playwright/test";

test.describe("Kanban board", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with board header and 5 columns", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Project Board" })).toBeVisible();

    // Expect 5 column headers visible
    const columnHeaders = page.locator("header ~ main .border-b-2");
    await expect(columnHeaders).toHaveCount(5);
  });

  test("loads with seed data cards present", async ({ page }) => {
    // Should have cards (from seed data)
    const cards = page.locator(".group.relative.bg-white");
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("can rename a column by clicking its title", async ({ page }) => {
    // Click the first column title button
    const firstColTitle = page.locator("header ~ main button").filter({ hasText: "Backlog" }).first();
    await firstColTitle.click();

    // Grab the editing input inside the column header while value is still Backlog
    const input = page.locator("header ~ main input").first();
    await expect(input).toBeVisible();

    // Clear and type new name, then confirm with Enter
    await input.fill("Ideas");
    await input.press("Enter");

    // Title should update in the button
    await expect(page.locator("header ~ main button").filter({ hasText: "Ideas" }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator("header ~ main button").filter({ hasText: /^Backlog$/ })).toHaveCount(0);
  });

  test("can cancel column rename with Escape", async ({ page }) => {
    const firstColTitle = page.locator("header ~ main button").filter({ hasText: "Backlog" }).first();
    await firstColTitle.click();

    const input = page.locator("header ~ main input").first();
    await expect(input).toBeVisible();
    await input.press("Escape");

    // Title should remain unchanged
    await expect(page.getByRole("button", { name: "Backlog" }).first()).toBeVisible();
  });

  test("can add a new card to a column", async ({ page }) => {
    // Click "Add a card" in the To Do column
    const toDoColumn = page.locator("header ~ main .flex.flex-col.w-64").filter({ hasText: "To Do" });
    await toDoColumn.getByRole("button", { name: /add a card/i }).click();

    // Form should appear
    await expect(toDoColumn.getByPlaceholder("Card title")).toBeVisible();

    // Fill out and submit
    await toDoColumn.getByPlaceholder("Card title").fill("New test card");
    await toDoColumn.getByPlaceholder("Details (optional)").fill("Test details here");
    await toDoColumn.getByRole("button", { name: /add card/i }).click();

    // Card should appear in the column
    await expect(toDoColumn.getByText("New test card")).toBeVisible();
    await expect(toDoColumn.getByText("Test details here")).toBeVisible();
  });

  test("can cancel adding a card", async ({ page }) => {
    const toDoColumn = page.locator("header ~ main .flex.flex-col.w-64").filter({ hasText: "To Do" });
    await toDoColumn.getByRole("button", { name: /add a card/i }).click();

    const titleInput = toDoColumn.getByPlaceholder("Card title");
    await expect(titleInput).toBeVisible();

    await toDoColumn.getByRole("button", { name: /cancel/i }).click();

    // Form should be gone
    await expect(titleInput).not.toBeVisible();
  });

  test("can delete a card", async ({ page }) => {
    // Get the Done column which has cards
    const doneColumn = page.locator("header ~ main .flex.flex-col.w-64").filter({ hasText: /^Done/ }).first();

    // Get the first card in Done column
    const firstCard = doneColumn.locator(".group.relative.bg-white").first();
    const cardTitle = await firstCard.locator(".text-sm.font-medium").textContent();

    // Hover to reveal the delete button
    await firstCard.hover();
    const deleteBtn = firstCard.getByRole("button", { name: /delete card/i });
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    // Card should be gone
    if (cardTitle) {
      await expect(doneColumn.getByText(cardTitle)).not.toBeVisible();
    }
  });

  test("can drag a card to another column", async ({ page }) => {
    // Use the Backlog column (has cards) and drag to To Do
    const backlogColumn = page.locator("header ~ main .flex.flex-col.w-64").filter({ hasText: "Backlog" }).first();
    const todoColumn = page.locator("header ~ main .flex.flex-col.w-64").filter({ hasText: "To Do" }).first();

    const firstCard = backlogColumn.locator(".group.relative.bg-white").first();
    const cardTitle = await firstCard.locator(".text-sm.font-medium").textContent();

    // Get bounding boxes
    const cardBox = await firstCard.boundingBox();
    const todoBox = await todoColumn.boundingBox();

    if (!cardBox || !todoBox) throw new Error("Could not find elements");

    // Perform drag from card center to To Do column center
    await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
    await page.mouse.down();
    // Move incrementally for smooth drag
    await page.mouse.move(cardBox.x + cardBox.width / 2 + 100, cardBox.y + cardBox.height / 2, { steps: 10 });
    await page.mouse.move(todoBox.x + todoBox.width / 2, todoBox.y + todoBox.height / 2, { steps: 20 });
    await page.mouse.up();

    // Card should now appear in To Do column
    if (cardTitle) {
      await expect(todoColumn.getByText(cardTitle)).toBeVisible({ timeout: 5000 });
    }
  });
});
