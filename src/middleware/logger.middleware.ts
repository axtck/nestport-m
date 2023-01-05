import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger('HTTP');
  public use(req: Request, res: Response, next: NextFunction): void {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    this.logger.log(`HTTP ${req.method} ${fullUrl} ${res.statusCode}`);
    next();
  }
}
