import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Use vi.hoisted so variables are available inside vi.mock factories
const { mockDb, mockRedis } = vi.hoisted(() => {
  const mockDb = {
    note: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  }
  const mockRedis = {
    get: vi.fn(),
    setex: vi.fn(),
    keys: vi.fn(),
    del: vi.fn(),
  }
  return { mockDb, mockRedis }
})

vi.mock('@/lib/db', () => ({ db: mockDb }))

vi.mock('@/lib/redis', () => ({
  redis: mockRedis,
  cached: vi.fn(async (_key: string, fn: () => Promise<unknown>) => fn()),
  invalidatePrefix: vi.fn(),
}))

import { GET as listGET, POST } from '@/app/api/notes/route'
import { GET as detailGET, DELETE } from '@/app/api/notes/[id]/route'

function makeRequest(url: string, options?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'), options)
}

const sampleNote = {
  id: 'cltest001',
  title: 'Test Note',
  content: 'Test content',
  createdAt: new Date('2026-03-10T00:00:00Z'),
  updatedAt: new Date('2026-03-10T00:00:00Z'),
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── GET /api/notes ────────────────────────────────────────────────────────
describe('GET /api/notes', () => {
  it('returns 200 with paginated notes', async () => {
    mockDb.note.findMany.mockResolvedValue([sampleNote])
    mockDb.note.count.mockResolvedValue(1)

    const req = makeRequest('http://localhost/api/notes?page=1&pageSize=20')
    const res = await listGET(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.total).toBe(1)
    expect(body.page).toBe(1)
  })

  it('uses default pagination when no params given', async () => {
    mockDb.note.findMany.mockResolvedValue([])
    mockDb.note.count.mockResolvedValue(0)

    const req = makeRequest('http://localhost/api/notes')
    const res = await listGET(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.pageSize).toBe(20)
  })

  it('returns 400 for invalid page param', async () => {
    const req = makeRequest('http://localhost/api/notes?page=abc')
    const res = await listGET(req)
    expect(res.status).toBe(400)
  })
})

// ─── POST /api/notes ───────────────────────────────────────────────────────
describe('POST /api/notes', () => {
  it('returns 201 with created note', async () => {
    mockDb.note.create.mockResolvedValue(sampleNote)

    const req = makeRequest('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Note', content: 'Test content' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.id).toBe('cltest001')
    expect(body.title).toBe('Test Note')
  })

  it('returns 400 when title is missing', async () => {
    const req = makeRequest('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify({ content: 'No title' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Validation failed')
  })

  it('returns 400 when content is missing', async () => {
    const req = makeRequest('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify({ title: 'No content' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Validation failed')
  })

  it('returns 400 when body is empty', async () => {
    const req = makeRequest('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when title exceeds 100 chars', async () => {
    const req = makeRequest('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify({ title: 'a'.repeat(101), content: 'ok' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })
})

// ─── GET /api/notes/[id] ──────────────────────────────────────────────────
describe('GET /api/notes/[id]', () => {
  it('returns 200 with the note when found', async () => {
    mockDb.note.findUnique.mockResolvedValue(sampleNote)

    const req = makeRequest('http://localhost/api/notes/cltest001')
    const ctx = { params: Promise.resolve({ id: 'cltest001' }) }
    const res = await detailGET(req, ctx)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe('cltest001')
  })

  it('returns 404 when note does not exist', async () => {
    mockDb.note.findUnique.mockResolvedValue(null)

    const req = makeRequest('http://localhost/api/notes/nonexistent')
    const ctx = { params: Promise.resolve({ id: 'nonexistent' }) }
    const res = await detailGET(req, ctx)

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBe('Note not found')
  })
})

// ─── DELETE /api/notes/[id] ───────────────────────────────────────────────
describe('DELETE /api/notes/[id]', () => {
  it('returns 200 with success:true when deleted', async () => {
    mockDb.note.findUnique.mockResolvedValue({ id: 'cltest001' })
    mockDb.note.delete.mockResolvedValue(sampleNote)
    mockRedis.keys.mockResolvedValue([])
    mockRedis.del.mockResolvedValue(1)

    const req = makeRequest('http://localhost/api/notes/cltest001', { method: 'DELETE' })
    const ctx = { params: Promise.resolve({ id: 'cltest001' }) }
    const res = await DELETE(req, ctx)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  it('returns 404 when note does not exist', async () => {
    mockDb.note.findUnique.mockResolvedValue(null)

    const req = makeRequest('http://localhost/api/notes/ghost', { method: 'DELETE' })
    const ctx = { params: Promise.resolve({ id: 'ghost' }) }
    const res = await DELETE(req, ctx)

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBe('Note not found')
  })
})
