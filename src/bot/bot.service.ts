import TelegramBot, { Update } from 'node-telegram-bot-api';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '../config';
import { UsersService } from '../users/users.service';
import { RatesService } from '../rates/rates.service';

import { RateDto } from '../rates/dto/rate.dto';

import { sleep } from '../utils/sleep';
import {
  formatDateTime,
  formatMoney,
  formatPercent,
} from '../utils/formatters';
import {
  SUBSCRIBE_MESSAGE,
  UNSUBSCRIBE_MESSAGE,
  WELCOME_MESSAGE,
} from './messages';

@Injectable()
export class BotService {
  constructor(
    private configService: ConfigService<AppConfig, true>,
    private usersService: UsersService,
    private ratesService: RatesService,
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
        { parse_mode: 'HTML' },
      );
      await sleep(100); // tg broadcast limitation
    }
  }

  private init() {
    this.bot.setWebHook(`${this.configService.get('appUrl')}/bot`);
    this.bot.setMyCommands([
      { command: '/start', description: 'Start' },
      { command: '/subscribe', description: 'Subscribe for rates updates' },
      {
        command: '/unsubscribe',
        description: 'Unsubscribe from rates updates',
      },
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
      this.bot.sendMessage(chatId, WELCOME_MESSAGE);
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
        await this.bot.sendMessage(chatId, SUBSCRIBE_MESSAGE, {
          parse_mode: 'HTML',
        });
        const last = await this.ratesService.getLast();
        const beforeLast = await this.ratesService.getLast(1);

        if (last) {
          this.notifyRatesChanged([chatId], last, beforeLast || last);
        }
      } else {
        await this.bot.sendMessage(chatId, 'Not Found!');
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
        this.bot.sendMessage(chatId, UNSUBSCRIBE_MESSAGE);
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

    const getSign = (val: number) => (val === 0 ? '⇨' : val > 0 ? '⇧' : '⇩');

    return `${dateFormatted}
<b>${formatMoney(rateBuy)} ◦ ${formatMoney(rateSell)}   (${formatPercent(
      spread,
    )})</b>
${getSign(buyChange)}${formatMoney(buyChange)}◦${getSign(
      sellChange,
    )}${formatMoney(sellChange)}(${getSign(spreadChange)}${formatPercent(
      spreadChange,
    )})`;
  }
}
