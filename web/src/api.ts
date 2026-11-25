export type Mode = 'checking' | 'live' | 'mock' | 'sample'

/** 'sample' means no backend is reachable, as on the frontend-only deployment. */
export async function getMode(): Promise<Mode> {
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return 'sample'
    const body = (await res.json()) as { provider?: string }
    if (body.provider === 'cloudflare') return 'live'
    return body.provider === 'mock' ? 'mock' : 'sample'
  } catch {
    return 'sample'
  }
}

export async function generate(photo: string, style: string, colour: string): Promise<string> {
  const form = new FormData()
  form.set('photo', await (await fetch(photo)).blob(), 'photo.jpg')
  form.set('style', style)
  form.set('colour', colour)

  let res: Response
  try {
    res = await fetch('/api/generations', { method: 'POST', headers: { 'x-hair-studio': '1' }, body: form })
  } catch {
    throw new Error("The server couldn't be reached. Try again.")
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? "This preview couldn't be created. Try again.")
  }
  return URL.createObjectURL(await res.blob())
}
