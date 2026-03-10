// ─── Note ────────────────────────────────────────────────────────────────────

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

export interface CreateNoteInput {
  title: string
  content: string
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface NoteListResponse {
  data: Note[]
  page: number
  pageSize: number
  total: number
  hasNextPage: boolean
}

export interface NoteResponse {
  data: Note
}

export interface ApiError {
  error: string
  message?: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number
  pageSize?: number
}
