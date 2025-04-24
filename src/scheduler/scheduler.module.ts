import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { GoldPriceModule } from '../gold-price/gold-price.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    GoldPriceModule,
  ],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {} 