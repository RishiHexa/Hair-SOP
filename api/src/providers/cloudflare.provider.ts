import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HEIGHT, WIDTH, type ImageProvider } from './image-provider.js'

const MODEL = '@cf/black-forest-labs/flux-2-klein-4b'
const TIMEOUT_MS = 60_000

interface RunResponse {
  result?: { image?: string }
  errors?: { code: number; message: string }[]
}

export class CloudflareProvider implements ImageProvider {
  readonly name = 'cloudflare'
  private readonly log = new Logger(CloudflareProvider.name)

  constructor(private readonly account: string, private readonly token: string) {}

  async edit(photo: Buffer, prompt: string): Promise<Buffer> {
    const form = new FormData()
    form.set('prompt', prompt)
    form.set('width', String(WIDTH))
    form.set('height', String(HEIGHT))
    form.set('input_image_0', new Blob([new Uint8Array(photo)], { type: 'image/jpeg' }), 'photo.jpg')

    let status = 0
    let body: RunResponse = {}
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.account}/ai/run/${MODEL}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}` },
        body: form,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
      status = res.status
      body = (await res.json()) as RunResponse
    } catch (e) {
      this.log.error(`Request failed (${status}): ${(e as Error).name}`)
      throw new HttpException('The image service did not respond. Try again.', HttpStatus.BAD_GATEWAY)
    }

    const image = body.result?.image
    if (status === 200 && image) return Buffer.from(image, 'base64')

    this.log.error(`Cloudflare ${status}: ${body.errors?.map((e) => `${e.code} ${e.message}`).join('; ')}`)
    if (status === 429) {
      throw new HttpException('The image service is busy or its daily limit has been reached.', HttpStatus.TOO_MANY_REQUESTS)
    }
    throw new HttpException('This preview could not be created. Try again.', HttpStatus.BAD_GATEWAY)
  }
}
