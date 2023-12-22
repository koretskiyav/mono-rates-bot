import { Body, Controller, Post } from '@nestjs/common';
import { Update } from 'node-telegram-bot-api';

import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private botService: BotService) {}

  @Post()
  handleMessage(@Body() message: Update) {
    return this.botService.handleMessage(message);
  }
}
