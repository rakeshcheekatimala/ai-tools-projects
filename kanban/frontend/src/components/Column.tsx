"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column as ColumnType, Card } from "@/lib/types";
import { KanbanCard } from "./KanbanCard";
import { AddCardForm } from "./AddCardForm";

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  onRenameColumn: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
}

/**
 * Renders a board column with a renameable header, sortable card list, and add-card affordance.
 */
export function Column({ column, cards, onRenameColumn, onAddCard, onDeleteCard }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showAddForm, setShowAddForm] = useState(false);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  function handleRenameSubmit() {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setEditTitle(column.title);
    }
    setIsEditing(false);
  }

  function handleRenameKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleRenameSubmit();
    if (e.key === "Escape") {
      setEditTitle(column.title);
      setIsEditing(false);
    }
  }

  const cardIds = cards.map((c) => c.id);

  return (
    <div className="flex flex-col w-64 min-w-[256px] max-w-[256px]">
      <div
        className={`flex flex-col rounded-xl h-full ${
          isOver ? "bg-blue-50" : "bg-gray-50"
        } border border-gray-200 transition-colors duration-150`}
      >
        {/* Column header */}
        <div className="px-3 pt-3 pb-2 border-b-2 border-[#ecad0a]">
          <div className="flex items-center justify-between gap-2">
            {isEditing ? (
              <input
                autoFocus
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={handleRenameKeyDown}
                className="flex-1 bg-transparent border-b border-[#209dd7] text-sm font-semibold text-[#032147] focus:outline-none px-0.5"
              />
            ) : (
              <button
                onClick={() => {
                  setEditTitle(column.title);
                  setIsEditing(true);
                }}
                title="Click to rename"
                className="flex-1 text-left text-sm font-semibold text-[#032147] hover:text-[#209dd7] transition-colors duration-150 truncate"
              >
                {column.title}
              </button>
            )}
            <span className="ml-1 min-w-[20px] text-center text-xs font-semibold rounded-full bg-gray-200 text-[#888888] px-1.5 py-0.5">
              {cards.length}
            </span>
          </div>
        </div>

        {/* Cards list */}
        <div ref={setNodeRef} className="flex-1 px-3 py-2 flex flex-col gap-2 min-h-[60px]">
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <KanbanCard key={card.id} card={card} onDelete={onDeleteCard} />
            ))}
          </SortableContext>
        </div>

        {/* Add card section */}
        <div className="px-3 pb-3">
          {showAddForm ? (
            <AddCardForm
              columnId={column.id}
              onAdd={(colId, title, details) => {
                onAddCard(colId, title, details);
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
            />
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full text-left text-xs text-[#209dd7] hover:text-[#1b87bb] font-medium py-1 flex items-center gap-1 transition-colors duration-150"
            >
              <span className="text-base leading-none">+</span> Add a card
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
