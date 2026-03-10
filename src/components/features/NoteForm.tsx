"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Note } from "@/types";

export function NoteForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      await api.post<Note>("/api/notes", { title: title.trim(), content: content.trim() });
      setTitle("");
      setContent("");
      router.refresh();
    } catch {
      setErrors({ title: "Failed to create note. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl">New Note</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            label="Title"
            placeholder="Note title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            maxLength={100}
            disabled={submitting}
          />
          <Textarea
            label="Content"
            placeholder="Write your note here…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={errors.content}
            rows={4}
            disabled={submitting}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" variant="primary" disabled={submitting}>
            <PlusCircle size={16} />
            {submitting ? "Creating…" : "Create Note"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
