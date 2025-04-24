import { Module } from '@nestjs/common';
import { GoldPriceService } from './gold-price.service';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  providers: [GoldPriceService],
  exports: [GoldPriceService],
})
export class GoldPriceModule {} 