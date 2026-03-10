import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/lib/api'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function makeResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

beforeEach(() => {
  mockFetch.mockReset()
})

describe('api.get', () => {
  it('calls fetch with correct URL and returns parsed JSON', async () => {
    mockFetch.mockResolvedValue(makeResponse({ data: [] }))
    const result = await api.get('/api/notes')
    expect(mockFetch).toHaveBeenCalledWith('/api/notes', expect.objectContaining({ headers: expect.any(Object) }))
    expect(result).toEqual({ data: [] })
  })

  it('throws when response is not ok', async () => {
    mockFetch.mockResolvedValue(makeResponse({ error: 'Not found' }, 404))
    await expect(api.get('/api/notes/bad-id')).rejects.toThrow()
  })
})

describe('api.post', () => {
  it('sends POST with JSON body and returns result', async () => {
    const note = { id: '1', title: 'Test', content: 'Body', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    mockFetch.mockResolvedValue(makeResponse(note, 201))
    const result = await api.post('/api/notes', { title: 'Test', content: 'Body' })
    expect(mockFetch).toHaveBeenCalledWith('/api/notes', expect.objectContaining({ method: 'POST' }))
    expect(result).toEqual(note)
  })

  it('throws on 400 validation error', async () => {
    mockFetch.mockResolvedValue(makeResponse({ error: 'Validation failed' }, 400))
    await expect(api.post('/api/notes', {})).rejects.toThrow()
  })
})

describe('api.del', () => {
  it('calls DELETE and returns result', async () => {
    mockFetch.mockResolvedValue(makeResponse({ success: true }))
    const result = await api.del('/api/notes/1')
    expect(mockFetch).toHaveBeenCalledWith('/api/notes/1', expect.objectContaining({ method: 'DELETE' }))
    expect(result).toEqual({ success: true })
  })
})
