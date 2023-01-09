import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Nestport')
  .setDescription('The Nestport API description')
  .setVersion('1.0')
  .addTag('nest')
  .build();
