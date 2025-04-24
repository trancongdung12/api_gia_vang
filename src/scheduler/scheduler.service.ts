import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GoldPriceService } from '../gold-price/gold-price.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly goldPriceService: GoldPriceService) {}

  // Run at 9:30 AM
  @Cron('30 9 * * *')
  async handleMorningGoldPriceUpdate() {
    this.logger.log('Starting morning gold price update (9:30 AM)');
    await this.goldPriceService.getAndSendGoldPrices();
  }

  // Run at 5:30 PM
  @Cron('30 17 * * *')
  async handleEveningGoldPriceUpdate() {
    this.logger.log('Starting evening gold price update (5:30 PM)');
    await this.goldPriceService.getAndSendGoldPrices();
  }

  // Method to manually trigger the update (useful for testing)
  async manualTriggerUpdate() {
    this.logger.log('Manually triggering gold price update');
    await this.goldPriceService.getAndSendGoldPrices();
  }
} 