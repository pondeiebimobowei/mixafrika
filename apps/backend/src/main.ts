import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SequelizeExceptionFilter } from './errors/sequelize';
import { LoggerService } from './logger/logger.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(utc);
dayjs.extend(isoWeek);


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://9000-firebase-studio-1759422244875.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev',
      'http://localhost:9002',
      'http://localhost:8081',
      'http://127.0.0.1:8081',
      'http://localhost:5173',
      'http://10.88.0.3:9002',
      'http://10.1.0.231:8081',
      'http://10.1.1.3:8081',
      'https://9000-firebase-mixafrica-app-1762205912355.cluster-lu4mup47g5gm4rtyvhzpwbfadi.cloudworkstations.dev',
      'https://6000-firebase-studio-1759422244875.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev',
      'https://mixafrica-app-frontend-ecgh.vercel.app',
      'https://mixafrica.vercel.app',
      'mixafrica.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });


  const PORT = process.env.PORT
  app.useGlobalFilters(new SequelizeExceptionFilter(new LoggerService()));
  await app.listen(PORT || 3003, ()=> {
    console.log(`server running ${process.env.PORT}`)
  });
}
bootstrap();
