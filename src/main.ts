import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config()

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
