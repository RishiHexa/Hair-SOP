import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  // Local only: there is no login yet, so this must not be reachable from the network.
  await app.listen(Number(process.env.PORT ?? 3000), '127.0.0.1')
}
void bootstrap()
