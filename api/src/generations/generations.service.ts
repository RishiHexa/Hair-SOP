import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import sharp from 'sharp'
import { IMAGE_PROVIDER } from '../providers/image-provider.js'
import type { ImageProvider } from '../providers/image-provider.js'
import { COLOURS, STYLES, buildPrompt } from './prompts.js'

// Cloudflare needs inputs under 512x512. Same 4:5 shape as the output.
const INPUT = { width: 400, height: 500 }
const DAILY_LIMIT = 80

@Injectable()
export class GenerationsService {
  private day = ''
  private used = 0

  constructor(@Inject(IMAGE_PROVIDER) private readonly provider: ImageProvider) {}

  get providerName() {
    return this.provider.name
  }

  async create(photo: Buffer, style: string, colour: string): Promise<Buffer> {
    if (!Object.hasOwn(STYLES, style)) throw new BadRequestException('Unknown hairstyle.')
    if (!Object.hasOwn(COLOURS, colour)) throw new BadRequestException('Unknown colour.')

    let input: Buffer
    try {
      // Re-encoding also drops EXIF data such as location.
      input = await sharp(photo, { limitInputPixels: 50_000_000 })
        .rotate()
        .resize({ ...INPUT, fit: 'cover' })
        .jpeg({ quality: 95 })
        .toBuffer()
    } catch {
      throw new BadRequestException('This photo could not be read.')
    }

    this.countUse()
    return this.provider.edit(input, buildPrompt(style, colour))
  }

  private countUse() {
    const today = new Date().toISOString().slice(0, 10) // Cloudflare's allowance resets at 00:00 UTC.
    if (today !== this.day) {
      this.day = today
      this.used = 0
    }
    if (this.used >= DAILY_LIMIT) {
      throw new HttpException('The daily free image limit has been reached.', HttpStatus.TOO_MANY_REQUESTS)
    }
    this.used++
  }
}
