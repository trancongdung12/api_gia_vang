// Import polyfill first
import './polyfill';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Vercel deployment
  app.enableCors();
  
  // Get port from environment variable or use default 3000
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
