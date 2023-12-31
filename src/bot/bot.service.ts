import TelegramBot, { Update } from 'node-telegram-bot-api';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '../config';
import { UsersService } from '../users/users.service';

import { RateDto } from '../rates/dto/rate.dto';

import { sleep } from '../utils/sleep';
import {
  formatDateTime,
  formatMoney,
  formatPercent,
} from '../utils/formatters';

@Injectable()
export class BotService {
  constructor(
    private configService: ConfigService<AppConfig, true>,
    private usersService: UsersService,
  ) {
    this.init();
  }

  private readonly logger = new Logger(BotService.name);
  private readonly bot = new TelegramBot(this.configService.get('tgToken'));

  handleMessage(message: Update) {
    this.logger.debug(
      `Received message "${message.message?.text}" from user "${message.message?.from?.username}"`,
    );
    this.bot.processUpdate(message);
  }

  async notifyRatesChanged(
    chatIds: number[],
    rate: RateDto,
    prevRate: RateDto,
  ) {
    for (const chatId of chatIds) {
      this.bot.sendMessage(
        chatId,
        await this.createChangesMessage(rate, prevRate),
        {
          parse_mode: 'HTML',
        },
      );
      await sleep(100); // tg broadcast limitation
    }
  }

  private init() {
    this.bot.setWebHook(`${this.configService.get('appUrl')}/bot`);
    this.bot.setMyCommands([
      { command: '/start', description: 'Start' },
      { command: '/subscribe', description: 'Subscribe' },
      { command: '/unsubscribe', description: 'Unsubscribe' },
    ]);
    this.bot.onText(/\/start/, this.handleStart);
    this.bot.onText(/\/subscribe/, this.handleSubscribe);
    this.bot.onText(/\/unsubscribe/, this.handleUnsubscribe);
  }

  private handleStart = async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    try {
      if (!(await this.usersService.findByChatId(chatId))) {
        this.usersService.create(chatId);
      }
      this.bot.sendMessage(chatId, 'Welcome!!!');
    } catch (err) {
      this.logger.error(err);
    }
  };

  private handleSubscribe = async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    try {
      const user = await this.usersService.findByChatId(chatId);
      if (user) {
        user.subscribed = true;
        await user.save();
        this.bot.sendMessage(chatId, 'Subscribed!');
      } else {
        this.bot.sendMessage(chatId, 'Not Found!');
      }
    } catch (err) {
      this.logger.error(err);
    }
  };

  private handleUnsubscribe = async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    try {
      const user = await this.usersService.findByChatId(chatId);
      if (user) {
        user.subscribed = false;
        await user.save();
        this.bot.sendMessage(chatId, 'Unsubscribed!');
      } else {
        this.bot.sendMessage(chatId, 'Not Found!');
      }
    } catch (err) {
      this.logger.error(err);
    }
  };

  private async createChangesMessage(rate: RateDto, prev: RateDto) {
    const { date, rateBuy, rateSell } = rate;

    const dateFormatted = formatDateTime(date);
    const buyChange = rateBuy - prev.rateBuy;
    const sellChange = rateSell - prev.rateSell;
    const spread = 1 - rateBuy / rateSell;
    const prevSpread = 1 - prev.rateBuy / prev.rateSell;
    const spreadChange = spread - prevSpread;

    const getSign = (val: number) => (val === 0 ? '⚪️' : val > 0 ? '🔴' : '🟢');

    return `<u><b>${dateFormatted}</b></u>:

    buy <b>${formatMoney(rateBuy)}</b> ${getSign(buyChange)} ${formatMoney(
      buyChange,
      true,
    )}
    sell <b>${formatMoney(rateSell)}</b> ${getSign(sellChange)} ${formatMoney(
      sellChange,
      true,
    )}
    spread <b>${formatPercent(spread)}</b> ${getSign(
      spreadChange,
    )} ${formatPercent(spreadChange, true)}`;
  }
}
