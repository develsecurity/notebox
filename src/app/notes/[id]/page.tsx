import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Header } from "@/components/features/Header";
import { DeleteButton } from "@/components/features/DeleteButton";
import type { Note } from "@/types";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

async function getNote(id: string): Promise<Note | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/notes/${id}`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch note");
  return res.json();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const note = await getNote(id);

  if (!note) notFound();

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors duration-150 mb-6"
        >
          <ArrowLeft size={14} />
          Back to notes
        </Link>

        {/* Note card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-slate-100 leading-snug flex-1">
              {note.title}
            </h1>
            <DeleteButton noteId={note.id} />
          </div>

          <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
            <Clock size={12} />
            <span>Created {formatDate(note.createdAt)}</span>
            {note.updatedAt !== note.createdAt && (
              <span className="text-slate-600">· Updated {formatDate(note.updatedAt)}</span>
            )}
          </div>

          <div className="border-t border-slate-700 pt-6">
            <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
