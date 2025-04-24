import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { GoldPriceModule } from './gold-price/gold-price.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    TelegramModule,
    GoldPriceModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
