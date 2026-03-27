"use client";

import { useReducer, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import { boardReducer } from "@/lib/boardReducer";
import { initialBoardState } from "@/lib/seed";
import { Card } from "@/lib/types";
import { Column } from "./Column";
import { KanbanCard } from "./KanbanCard";

/**
 * Root board component managing all board state and drag-and-drop coordination.
 */
export function Board() {
  const [state, dispatch] = useReducer(boardReducer, initialBoardState);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function getCardsForColumn(columnId: string): Card[] {
    return state.cards.filter((c) => c.columnId === columnId);
  }

  function handleDragStart(event: DragStartEvent) {
    const card = state.cards.find((c) => c.id === event.active.id);
    setActiveCard(card ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    const activeCard = state.cards.find((c) => c.id === activeCardId);
    if (!activeCard) return;

    // Determine whether we're hovering over a column or a card
    const overColumn = state.columns.find((col) => col.id === overId);
    const overCard = state.cards.find((c) => c.id === overId);

    if (!overColumn && !overCard) return;
    if (activeCard.columnId === (overColumn?.id ?? overCard?.columnId)) return;

    const toColumnId = overColumn?.id ?? overCard?.columnId ?? activeCard.columnId;
    const destCards = state.cards.filter((c) => c.columnId === toColumnId && c.id !== activeCardId);
    const overCardIndex = overCard ? destCards.findIndex((c) => c.id === overId) : destCards.length;
    const toIndex = overCardIndex === -1 ? destCards.length : overCardIndex;

    dispatch({ type: "MOVE_CARD", cardId: activeCardId, toColumnId, toIndex });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    const activeCard = state.cards.find((c) => c.id === activeCardId);
    if (!activeCard) return;

    // Reorder within same column
    const overCard = state.cards.find((c) => c.id === overId);
    if (overCard && overCard.columnId === activeCard.columnId && activeCardId !== overId) {
      const columnCards = state.cards.filter((c) => c.columnId === activeCard.columnId);
      const oldIndex = columnCards.findIndex((c) => c.id === activeCardId);
      const newIndex = columnCards.findIndex((c) => c.id === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        dispatch({
          type: "MOVE_CARD",
          cardId: activeCardId,
          toColumnId: activeCard.columnId,
          toIndex: newIndex,
        });
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 items-start pb-6">
        {state.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            cards={getCardsForColumn(column.id)}
            onRenameColumn={(columnId, title) =>
              dispatch({ type: "RENAME_COLUMN", columnId, title })
            }
            onAddCard={(columnId, title, details) =>
              dispatch({ type: "ADD_CARD", columnId, title, details })
            }
            onDeleteCard={(cardId) => dispatch({ type: "DELETE_CARD", cardId })}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="rotate-2 scale-105">
            <KanbanCard card={activeCard} onDelete={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
