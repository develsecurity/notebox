import { Suspense } from "react";
import { Header } from "@/components/features/Header";
import { NoteCard } from "@/components/features/NoteCard";
import { NoteForm } from "@/components/features/NoteForm";
import { Pagination } from "@/components/features/Pagination";
import type { NoteListResponse } from "@/types";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

async function getNotes(page: number): Promise<NoteListResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/notes?page=${page}&pageSize=20`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  let notes: NoteListResponse = { data: [], total: 0, page, pageSize: 20, hasNextPage: false };
  try {
    notes = await getNotes(page);
  } catch {
    // show empty state on error
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Sidebar — new note form */}
          <aside className="w-full lg:w-80 lg:shrink-0">
            <NoteForm />
          </aside>

          {/* Main — notes list */}
          <main className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-4">
              <h1 className="text-2xl font-bold text-slate-100">Notes</h1>
              {notes.total > 0 && (
                <span className="text-sm text-slate-400">{notes.total} total</span>
              )}
            </div>

            {notes.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <p className="text-slate-400 text-lg">No notes yet.</p>
                <p className="text-slate-500 text-sm">Create your first note using the form.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {notes.data.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}

            <Suspense>
              <Pagination
                page={notes.page}
                total={notes.total}
                pageSize={notes.pageSize}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
