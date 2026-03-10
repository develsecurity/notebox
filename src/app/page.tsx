import { Suspense } from "react";
import { Header } from "@/components/features/Header";
import { NoteCard } from "@/components/features/NoteCard";
import { NoteForm } from "@/components/features/NoteForm";
import { Pagination } from "@/components/features/Pagination";
import { db } from "@/lib/db";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  let notes: Awaited<ReturnType<typeof db.note.findMany>> = [];
  let total = 0;
  try {
    [notes, total] = await Promise.all([
      db.note.findMany({ orderBy: { createdAt: "desc" }, skip, take: pageSize }),
      db.note.count(),
    ]);
  } catch {
    // show empty state on error
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="w-full lg:w-80 lg:shrink-0">
            <NoteForm />
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-4">
              <h1 className="text-2xl font-bold text-slate-100">Notes</h1>
              {total > 0 && (
                <span className="text-sm text-slate-400">{total} total</span>
              )}
            </div>

            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <p className="text-slate-400 text-lg">No notes yet.</p>
                <p className="text-slate-500 text-sm">Create your first note using the form.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}

            <Suspense>
              <Pagination page={page} total={total} pageSize={pageSize} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}