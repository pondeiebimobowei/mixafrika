import 'pg';
import 'pg-hstore';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SequelizeExceptionFilter } from './errors/sequelize';
import { LoggerService } from './logger/logger.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

dayjs.extend(utc);
dayjs.extend(isoWeek);

const server = express();
let cachedServer: any;

async function bootstrapNestApp(expressInstance: express.Express) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  const configService = app.get(ConfigService);
  const cors = (configService.get('CORS_ORIGINS') || '')
    .split(/[\n,]/)
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: cors.length ? cors : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.useGlobalFilters(new SequelizeExceptionFilter(new LoggerService()));
  await app.init();
  return app;
}

// Standalone execution (Local dev / Docker / Non-Vercel environment)
if (!process.env.VERCEL) {
  bootstrapNestApp(server).then(async (app) => {
    const port = Number(process.env.PORT || 3003);
    await app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  });
}

// Vercel Serverless Function entrypoint
export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    await bootstrapNestApp(server);
    cachedServer = server;
  }
  return cachedServer(req, res);
}

