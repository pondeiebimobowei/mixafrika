
import { NestMiddleware  } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger = new Logger(LoggerService.name);

  log(message: string) {
    this.logger.log(message);
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    this.logger.log(
      `--> ${req.method} ${req.originalUrl} - Starting Request...`,
    );

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { method, originalUrl } = req;
      const { statusCode } = res;
      
      const logMessage = `<-- ${method} ${originalUrl} ${statusCode} [${duration}ms]`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}