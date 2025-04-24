import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { TelegramService } from '../telegram/telegram.service';

export interface GoldPrice {
  name: string;
  type?: string;
  purity?: string;
  buyPrice: number;
  sellPrice: number;
  datetime: string;
}

@Injectable()
export class GoldPriceService {
  private readonly logger = new Logger(GoldPriceService.name);
  private readonly apiUrl = 'https://edge-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=00';
  private lastDatetime: string = '';

  constructor(private readonly telegramService: TelegramService) {}

  async fetchGoldPrices(): Promise<GoldPrice[]> {
    try {
      this.logger.log('Fetching gold prices from PNJ API...');
      const response = await axios.get(this.apiUrl);
      const items = response.data.data;
      
      const goldPrices: GoldPrice[] = [];
      
      for (const item of items) {
        // Only include items where name contains "Nhẫn Trơn"
        if (item.tensp && item.tensp.includes('Nhẫn Trơn')) {
          goldPrices.push({
            name: item.tensp,
            buyPrice: item.giamua,
            sellPrice: item.giaban,
            datetime: item.createDate,
          });
        }
      }
      
      this.logger.log(`Found ${goldPrices.length} gold ring products from PNJ`);
      return goldPrices;
    } catch (error) {
      this.logger.error(`Error fetching gold prices: ${error.message}`);
      throw error;
    }
  }

  async getAndSendGoldPrices(): Promise<void> {
    try {
      const goldPrices = await this.fetchGoldPrices();
      if (goldPrices.length > 0) {
        // Get the most recent datetime from the fetched prices
        const mostRecentDatetime = this.getMostRecentDatetime(goldPrices);
        
        // Check if the datetime has changed since the last check
        if (mostRecentDatetime !== this.lastDatetime) {
          this.logger.log(`New price update detected. Previous: ${this.lastDatetime || 'none'}, Current: ${mostRecentDatetime}`);
          
          // Update the last datetime
          this.lastDatetime = mostRecentDatetime;
          
          // Send the prices to Telegram
          await this.telegramService.sendGoldPrices(goldPrices);
          this.logger.log('Gold prices sent to Telegram successfully');
        } else {
          this.logger.log(`No price changes detected. Last update: ${this.lastDatetime}`);
        }
      } else {
        this.logger.warn('No gold prices fetched');
      }
    } catch (error) {
      this.logger.error(`Failed to get and send gold prices: ${error.message}`);
    }
  }
  
  private getMostRecentDatetime(prices: GoldPrice[]): string {
    // If no prices, return empty string
    if (prices.length === 0) {
      return '';
    }
    
    // Convert the datetime strings to Date objects for comparison
    const parseDatetime = (dateStr: string): Date => {
      // Expected format: 24/04/2025 09:02
      const [datePart, timePart] = dateStr.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      
      return new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1, // Month is 0-indexed in JavaScript
        parseInt(day, 10),
        parseInt(hours, 10),
        parseInt(minutes, 10)
      );
    };
    
    // Sort the prices by datetime (most recent first)
    const sortedPrices = [...prices].sort((a, b) => {
      const dateA = parseDatetime(a.datetime);
      const dateB = parseDatetime(b.datetime);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Return the most recent datetime
    return sortedPrices[0].datetime;
  }
} 