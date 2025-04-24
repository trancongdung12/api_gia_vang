import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SchedulerService } from './scheduler/scheduler.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly schedulerService: SchedulerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('trigger-update')
  async triggerGoldPriceUpdate(): Promise<{ message: string }> {
    await this.schedulerService.manualTriggerUpdate();
    return { message: 'Gold price update triggered' };
  }
}
