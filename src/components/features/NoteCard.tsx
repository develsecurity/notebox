import Link from "next/link";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={`/notes/${note.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-lg">
      <Card interactive>
        <CardHeader>
          <CardTitle className="line-clamp-1">{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-slate-400 text-sm leading-relaxed">
            {note.content}
          </p>
        </CardContent>
        <CardFooter>
          <Clock size={12} className="text-slate-500" />
          <span className="text-xs text-slate-500">{formatDate(note.createdAt)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
