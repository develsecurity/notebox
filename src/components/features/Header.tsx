import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 h-14 flex items-center border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm px-4">
      <div className="mx-auto w-full max-w-4xl flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-100 hover:text-cyan-400 transition-colors duration-150"
        >
          <BookOpen size={18} className="text-cyan-400" />
          <span className="text-lg font-bold tracking-tight">NoteBox</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-400">
          <Link
            href="/"
            className="hover:text-slate-100 transition-colors duration-150"
          >
            Notes
          </Link>
        </nav>
      </div>
    </header>
  );
}
