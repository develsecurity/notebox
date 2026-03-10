import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('deduplicates tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('returns empty string for no input', () => {
    expect(cn()).toBe('')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('foo', undefined, null as unknown as string)).toBe('foo')
  })
})
