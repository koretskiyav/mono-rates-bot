import { Controller, Get } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private botService: BotService) {}

  @Get()
  getBot(): string {
    return this.botService.getBot();
  }
}
