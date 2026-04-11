import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SequelizeExceptionFilter } from './errors/sequelize';
import { LoggerService } from './logger/logger.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import { ConfigService } from '@nestjs/config';

dayjs.extend(utc);
dayjs.extend(isoWeek);


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const cors = configService.get('CORS_ORIGINS')?.split('\n') || [];
  app.enableCors({
    origin: cors,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const PORT = process.env.PORT
  app.useGlobalFilters(new SequelizeExceptionFilter(new LoggerService()));
  await app.listen(PORT || 3003, '0.0.0.0', ()=> {
    console.log(`server runningS ${process.env.PORT}`)
  });
}
bootstrap();
