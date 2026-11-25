import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import sharp from 'sharp'
import { IMAGE_PROVIDER } from '../providers/image-provider.js'
import type { ImageProvider } from '../providers/image-provider.js'
import { COLOURS, STYLES, buildPrompt } from './prompts.js'

// Cloudflare needs inputs under 512x512. Same 4:5 shape as the output.
const INPUT = { width: 400, height: 500 }

@Injectable()
export class GenerationsService {
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

    return this.provider.edit(input, buildPrompt(style, colour))
  }
}
