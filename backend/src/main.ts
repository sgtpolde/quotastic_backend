import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://quota-frontend-sage.vercel.app'],
    credentials: true,
    exposedHeaders: ['Access-Control-Allow-Origin'],
  });
  await app.listen(8000);
}
bootstrap();
