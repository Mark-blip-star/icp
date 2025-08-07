import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SupabaseService } from './database/supabase.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    
    const configService = app.get(ConfigService);
    const port = configService.get<number>('socketPort', 3008);
    
    // SupabaseService will test connection in onModuleInit
    const supabaseService = app.get(SupabaseService);
    
    await app.listen(port);
    logger.log(`LinkedIn Automation Server is running on port ${port}`);
    
  } catch (error) {
    logger.error('Failed to start application:');
    logger.error(error);
    process.exit(1);
  }
}

bootstrap();
