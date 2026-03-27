import { BoardLoader } from "@/components/BoardLoader";

/** Main board page — renders the single Kanban board. */
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-[#032147] shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-[#ecad0a]" />
            <h1 className="text-xl font-bold text-white tracking-tight">Project Board</h1>
          </div>
          <p className="text-sm text-white/50 hidden sm:block">
            Click any column title to rename it
          </p>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 px-6 py-6 overflow-x-auto">
        <BoardLoader />
      </main>
    </div>
  );
}
