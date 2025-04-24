import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { GoldPrice } from '../gold-price/gold-price.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf;
  private chatId: string;
  private isGroupChat: boolean;

  constructor() {
    // Using provided Telegram credentials
    const token = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    
    // Check if this is a group chat (negative chat ID)
    this.isGroupChat = this.chatId.startsWith('-');
    
    this.bot = new Telegraf(token);
    this.logger.log(`Telegram service initialized for ${this.isGroupChat ? 'group chat' : 'private chat'} (ID: ${this.chatId})`);
    
    // Initialize the bot
    this.initBot();
  }
  
  private initBot() {
    // Add error handling
    this.bot.catch((err: any, ctx) => {
      this.logger.error(`Telegram bot error: ${err.message}`);
    });
  }

  async sendGoldPrices(goldPrices: GoldPrice[]): Promise<void> {
    try {
      if (goldPrices.length === 0) {
        this.logger.warn('No gold prices to send');
        return;
      }
      
      const message = this.formatGoldPricesMessage(goldPrices);
      
      this.logger.log(`Sending message to chat ID: ${this.chatId}`);
      await this.bot.telegram.sendMessage(this.chatId, message, { parse_mode: 'HTML' });
      this.logger.log(`Gold prices sent to chat ${this.chatId}`);
    } catch (error) {
      this.logger.error(`Failed to send message to Telegram: ${error.message}`);
      if (error.message.includes('bot was blocked') || error.message.includes('chat not found')) {
        this.logger.error('The bot may not have been added to the chat or was blocked by the user');
      } else if (error.message.includes('not enough rights')) {
        this.logger.error('The bot does not have permission to send messages in this chat');
      }
      throw error;
    }
  }

  private formatGoldPricesMessage(goldPrices: GoldPrice[]): string {
    const now = new Date().toLocaleString('vi-VN');
    let message = ``;
    
    for (const price of goldPrices) {
      message += `<b>${price.name}</b>\n`;
      
      message += `Giá mua: ${this.formatCurrency(price.buyPrice)} VND\n`;
      
      if (price.sellPrice > 0) {
        message += `Giá bán: ${this.formatCurrency(price.sellPrice)} VND\n`;
      }
      
      message += `Thời gian cập nhật: ${price.datetime}\n\n`;
    }
    
    message += '<i>Data provided by PNJ Gold</i>';
    return message;
  }

  private formatCurrency(amount: number): string {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
} 