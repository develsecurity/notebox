import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { cached, invalidatePrefix } from '@/lib/redis'

const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  content: z.string().min(1, 'Content is required'),
})

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const parsed = paginationSchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid pagination params' }, { status: 400 })
    }

    const { page, pageSize } = parsed.data
    const cacheKey = `notes:list:${page}:${pageSize}`

    const result = await cached(
      cacheKey,
      async () => {
        const [data, total] = await Promise.all([
          db.note.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
          db.note.count(),
        ])
        return { data, total, page, pageSize }
      },
      60
    )

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/notes]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createNoteSchema.safeParse(body)

    if (!parsed.success) {
      const details = parsed.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
      return NextResponse.json({ error: 'Validation failed', details }, { status: 400 })
    }

    const note = await db.note.create({ data: parsed.data })
    await invalidatePrefix('notes:list:')

    return NextResponse.json(note, { status: 201 })
  } catch (err) {
    console.error('[POST /api/notes]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
