export const IMAGE_PROVIDER = Symbol('IMAGE_PROVIDER')

export interface ImageProvider {
  readonly name: string
  /** Returns a WIDTH x HEIGHT JPEG. */
  edit(photo: Buffer, prompt: string): Promise<Buffer>
}

export const WIDTH = 768
export const HEIGHT = 960
