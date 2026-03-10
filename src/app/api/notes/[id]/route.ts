import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cached, invalidatePrefix, redis } from '@/lib/redis'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const cacheKey = `notes:single:${id}`

    const note = await cached(
      cacheKey,
      async () => {
        return db.note.findUnique({ where: { id } })
      },
      60
    )

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (err) {
    console.error('[GET /api/notes/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params

    const existing = await db.note.findUnique({ where: { id }, select: { id: true } })
    if (!existing) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    await db.note.delete({ where: { id } })

    await Promise.all([
      invalidatePrefix('notes:list:'),
      redis.del(`notes:single:${id}`),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/notes/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
