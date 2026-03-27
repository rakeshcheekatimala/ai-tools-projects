"use client";

import dynamic from "next/dynamic";

/**
 * Client-only wrapper that lazily imports the Board.
 * Keeping ssr:false here (in a Client Component) is required by Next.js —
 * the option is not permitted in Server Components.
 */
const Board = dynamic(() => import("./Board").then((m) => m.Board), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-32 text-[#888888] text-sm">
      Loading board...
    </div>
  ),
});

/** Renders the lazily-loaded Board component. */
export function BoardLoader() {
  return <Board />;
}
