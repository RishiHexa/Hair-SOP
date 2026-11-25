import sharp from 'sharp'
import { HEIGHT, WIDTH, type ImageProvider } from './image-provider.js'

/** Returns a grey copy of the photo, so the app can run without using quota. */
export class MockProvider implements ImageProvider {
  readonly name = 'mock'

  edit(photo: Buffer): Promise<Buffer> {
    return sharp(photo).resize(WIDTH, HEIGHT).grayscale().jpeg().toBuffer()
  }
}
