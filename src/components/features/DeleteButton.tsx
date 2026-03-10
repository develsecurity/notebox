"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface DeleteButtonProps {
  noteId: string;
}

export function DeleteButton({ noteId }: DeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this note? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.del(`/api/notes/${noteId}`);
      router.push("/");
      router.refresh();
    } catch {
      setDeleting(false);
      alert("Failed to delete note. Please try again.");
    }
  }

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
    >
      <Trash2 size={14} />
      {deleting ? "Deleting…" : "Delete"}
    </Button>
  );
}
