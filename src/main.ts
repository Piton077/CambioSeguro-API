import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HandlingExceptionFilter } from './application/http/filter/handling-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HandlingExceptionFilter());
  await app.listen(3000);
}
bootstrap();
