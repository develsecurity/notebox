import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  ttl = 60
): Promise<T> {
  const hit = await redis.get<T>(key)
  if (hit !== null) return hit
  const value = await fn()
  await redis.set(key, value, { ex: ttl })
  return value
}

export async function invalidatePrefix(prefix: string): Promise<void> {
  const keys = await redis.keys(`${prefix}*`)
  if (keys.length > 0) {
    await redis.del(...(keys as [string, ...string[]]))
  }
}
