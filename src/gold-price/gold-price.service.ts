import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { TelegramService } from '../telegram/telegram.service';

export interface GoldPrice {
  name: string;
  type: string;
  purity: string;
  buyPrice: number;
  sellPrice: number;
  datetime: string;
}

@Injectable()
export class GoldPriceService {
  private readonly logger = new Logger(GoldPriceService.name);
  private readonly apiUrl = 'http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3kd8ub1llcg9t45hnoh8hmn7t5kc2v';
  private lastDatetime: string = '';

  constructor(private readonly telegramService: TelegramService) {}

  async fetchGoldPrices(): Promise<GoldPrice[]> {
    try {
      this.logger.log('Fetching gold prices...');
      const response = await axios.get(this.apiUrl);
      const data = response.data.DataList.Data;
      
      const goldPrices: GoldPrice[] = [];
      
      for (const item of data) {
        // Extract row number
        const rowNumber = item['@row'];
        
        // Use row number to construct the correct property names
        const name = item[`@n_${rowNumber}`];
        const type = item[`@k_${rowNumber}`];
        const purity = item[`@h_${rowNumber}`];
        const buyPrice = parseInt(item[`@pb_${rowNumber}`], 10);
        const sellPrice = parseInt(item[`@ps_${rowNumber}`], 10);
        const datetime = item[`@d_${rowNumber}`];
        
        // Only include items where name contains "NHẪN"
        if (name && type && purity && name.includes('NHẪN')) {
          goldPrices.push({
            name,
            type,
            purity,
            buyPrice,
            sellPrice,
            datetime,
          });
        }
      }
      
      this.logger.log(`Found ${goldPrices.length} gold ring products`);
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
          
          // Filter out duplicates (by name) to only get the latest prices
          const uniquePrices = this.getUniquePrices(goldPrices);
          
          // Send the prices to Telegram
          await this.telegramService.sendGoldPrices(uniquePrices);
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

  private getUniquePrices(prices: GoldPrice[]): GoldPrice[] {
    // Use a Map to keep only the latest entry for each unique name
    const uniquePricesMap = new Map<string, GoldPrice>();
    
    for (const price of prices) {
      uniquePricesMap.set(price.name, price);
    }
    
    return Array.from(uniquePricesMap.values());
  }
  
  private getMostRecentDatetime(prices: GoldPrice[]): string {
    // If no prices, return empty string
    if (prices.length === 0) {
      return '';
    }
    
    // Convert the datetime strings to Date objects for comparison
    const parseDatetime = (dateStr: string): Date => {
      // Expected format: 24/04/2025 09:03
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