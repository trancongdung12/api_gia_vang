import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoldPriceService } from '../gold-price/gold-price.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly goldPriceService: GoldPriceService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleGoldPriceUpdate() {
    this.logger.log('Starting hourly gold price update');
    await this.goldPriceService.getAndSendGoldPrices();
  }

  // Method to manually trigger the update (useful for testing)
  async manualTriggerUpdate() {
    this.logger.log('Manually triggering gold price update');
    await this.goldPriceService.getAndSendGoldPrices();
  }
} 