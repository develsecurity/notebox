"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
}

export function Pagination({ page, total, pageSize }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  function goTo(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft size={14} />
        Prev
      </Button>
      <span className="text-sm text-slate-400">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
      >
        Next
        <ChevronRight size={14} />
      </Button>
    </div>
  );
}
