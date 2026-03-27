"use client";

import { useState } from "react";

interface AddCardFormProps {
  columnId: string;
  onAdd: (columnId: string, title: string, details: string) => void;
  onCancel: () => void;
}

/**
 * Inline form for adding a new card to a column.
 */
export function AddCardForm({ columnId, onAdd, onCancel }: AddCardFormProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(columnId, trimmed, details);
    setTitle("");
    setDetails("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
      <input
        autoFocus
        type="text"
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border border-gray-200 px-2.5 py-1.5 text-sm text-[#032147] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#209dd7] focus:border-transparent"
      />
      <textarea
        placeholder="Details (optional)"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={2}
        className="w-full rounded border border-gray-200 px-2.5 py-1.5 text-sm text-[#032147] placeholder-[#888888] resize-none focus:outline-none focus:ring-2 focus:ring-[#209dd7] focus:border-transparent"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 rounded py-1.5 text-xs font-semibold text-white bg-[#753991] hover:bg-[#5e2d76] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Add Card
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded py-1.5 text-xs font-semibold text-[#888888] bg-gray-100 hover:bg-gray-200 transition-colors duration-150"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
