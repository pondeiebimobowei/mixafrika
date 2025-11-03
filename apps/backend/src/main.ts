import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SequelizeExceptionFilter } from './errors/sequelize';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://9000-firebase-studio-1759422244875.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev',
      'http://localhost:9002',
      'https://6000-firebase-studio-1759422244875.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev',
      'https://mixafrica-app-frontend-ecgh.vercel.app',
      'https://mixafrica.vercel.app',
      'mixafrica.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });
  app.useGlobalFilters(new SequelizeExceptionFilter(new LoggerService()));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
