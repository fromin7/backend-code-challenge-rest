import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  await app.close();
}
bootstrap();
