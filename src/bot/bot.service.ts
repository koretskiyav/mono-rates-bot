import TelegramBot, { Update } from 'node-telegram-bot-api';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from 'src/config';

@Injectable()
export class BotService {
  constructor(private configService: ConfigService<AppConfig, true>) {}
  private readonly logger = new Logger(BotService.name);

  private readonly bot = createBot(
    this.configService.get('tgToken'),
    this.configService.get('appUrl'),
  );

  handleMessage(message: Update) {
    this.logger.debug(
      `Received message "${message.message?.text}" from user "${message.message?.from?.username}"`,
    );
    this.bot.processUpdate(message);
  }
}

function createBot(token: string, appUrl: string) {
  const bot = new TelegramBot(token);

  bot.setWebHook(`${appUrl}/bot`);

  bot.setMyCommands([{ command: '/start', description: 'Start' }]);

  bot.onText(/\/start/, handleStart);

  async function handleStart(msg: TelegramBot.Message) {
    bot.sendMessage(msg.chat.id, 'Welcome back!');
  }

  return bot;
}
