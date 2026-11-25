import { Module } from '@nestjs/common'
import { GenerationsController } from './generations/generations.controller.js'
import { GenerationsService } from './generations/generations.service.js'
import { CloudflareProvider } from './providers/cloudflare.provider.js'
import { IMAGE_PROVIDER } from './providers/image-provider.js'
import { MockProvider } from './providers/mock.provider.js'

@Module({
  controllers: [GenerationsController],
  providers: [
    GenerationsService,
    {
      provide: IMAGE_PROVIDER,
      useFactory: () => {
        const account = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
        const token = process.env.CLOUDFLARE_API_TOKEN?.trim()
        if (process.env.IMAGE_PROVIDER === 'mock' || !account || !token) return new MockProvider()
        return new CloudflareProvider(account, token)
      },
    },
  ],
})
export class AppModule {}
