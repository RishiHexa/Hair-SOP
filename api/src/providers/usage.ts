import { readFileSync, writeFileSync } from 'node:fs'
import { HttpException, HttpStatus } from '@nestjs/common'

// Cloudflare's free allowance is 10,000 neurons a day, resetting at 00:00 UTC. One image costs at most about 110
// (4 output tiles x 26.05 + 1 input tile x 5.37), so 80 images stay under 8,800 and leave a margin.
// Saved to disk so restarts can't reset it, and checked for every request, including test scripts.
const DAILY_LIMIT = 80
const FILE = process.env.USAGE_FILE ?? new URL('../../.usage.json', import.meta.url)

function limitReached(message: string) {
  return new HttpException(message, HttpStatus.TOO_MANY_REQUESTS)
}

export function reserveImage() {
  const today = new Date().toISOString().slice(0, 10)
  let used = 0
  try {
    const saved = JSON.parse(readFileSync(FILE, 'utf8')) as { day?: unknown; used?: unknown }
    if (typeof saved.day !== 'string' || !Number.isInteger(saved.used)) throw new Error('bad usage file')
    if (saved.day === today) used = saved.used as number
  } catch (e) {
    // A missing file means nothing has been used. Anything else is unclear, so stop instead of guessing.
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw limitReached('Image usage could not be checked, so no image was requested.')
    }
  }
  if (used >= DAILY_LIMIT) throw limitReached('The daily free image limit has been reached.')
  // Counted before the request, so failed requests count too.
  writeFileSync(FILE, JSON.stringify({ day: today, used: used + 1 }))
}
