"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/lib/types";

interface KanbanCardProps {
  card: Card;
  onDelete: (cardId: string) => void;
}

/**
 * A draggable Kanban card displaying title and details.
 * Delete button appears on hover.
 */
export function KanbanCard({ card, onDelete }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group relative bg-white rounded-lg shadow-sm border border-gray-100 p-3 cursor-grab active:cursor-grabbing select-none ${
        isDragging ? "opacity-40 shadow-lg ring-2 ring-blue-300" : "hover:shadow-md"
      } transition-all duration-150`}
      {...listeners}
    >
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(card.id);
        }}
        aria-label="Delete card"
        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150 focus:opacity-100"
      >
        ×
      </button>
      <p className="text-sm font-medium text-[#032147] leading-snug pr-5">{card.title}</p>
      {card.details && (
        <p className="mt-1 text-xs text-[#888888] leading-relaxed line-clamp-2">{card.details}</p>
      )}
    </div>
  );
}
