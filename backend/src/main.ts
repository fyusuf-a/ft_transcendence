import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Transcendence')
    .setDescription('Transcendence API')
    .setVersion('0.0.1')
    .addTag('auth')
    .addTag('users')
    .addTag('relationships')
    .addTag('channels')
    .addTag('channel memberships')
    .addTag('messages')
    .addTag('achievements')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors();
  await app.listen(process.env.BACKEND_PORT ? process.env.BACKEND_PORT : 3000);
}
bootstrap();
