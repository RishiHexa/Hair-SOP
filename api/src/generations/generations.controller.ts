import {
  BadRequestException, Body, Controller, ForbiddenException, Get, Headers, HttpCode, Post, StreamableFile,
  UploadedFile, UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { GenerationsService } from './generations.service.js'

@Controller()
export class GenerationsController {
  constructor(private readonly generations: GenerationsService) {}

  @Get('health')
  health() {
    return { ok: true, provider: this.generations.providerName }
  }

  @Post('generations')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: 10 * 1024 * 1024, files: 1 } }))
  async create(
    @Headers('x-hair-studio') client: string | undefined,
    @UploadedFile() photo: Express.Multer.File | undefined,
    @Body() body: { style?: string; colour?: string } | undefined,
  ) {
    // A custom header forces a CORS preflight, so other websites can't spend the quota.
    if (client !== '1') throw new ForbiddenException()
    if (!photo) throw new BadRequestException('Add a photo.')
    const image = await this.generations.create(photo.buffer, String(body?.style), String(body?.colour))
    return new StreamableFile(image, { type: 'image/jpeg' })
  }
}
