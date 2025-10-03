import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Products API')
    .setDescription('CRUD de productos')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, doc);
  const allowList = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://vende-challenge.vercel.app',
  ];
  const vercelPreview = /^https:\/\/[a-z0-9-]+--vende-challenge\.vercel\.app$/;

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowList.includes(origin) || vercelPreview.test(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`CORS bloqueado para ${origin}`), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    maxAge: 86400,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();