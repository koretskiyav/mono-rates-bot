import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MonoService } from '../mono/mono.service';
import { RatesService } from '../rates/rates.service';
import { UsersService } from '../users/users.service';
import { BotService } from '../bot/bot.service';

import { RateDto } from '../rates/dto/rate.dto';
import { pairToText } from '../utils/pairToText';

const TEMP_INITIAL_DATA: [string, number, number][] = [
  ['2024-01-23 22:01:13+00', 37.42, 38.0199],
  ['2024-01-24 08:40:06+00', 37.45, 38.0199],
  ['2024-01-24 11:26:13+00', 37.46, 38.0199],
  ['2024-01-24 14:56:13+00', 37.43, 38.0199],
  ['2024-01-25 08:56:13+00', 37.45, 38.0199],
  ['2024-01-25 12:20:06+00', 37.48, 38.0199],
];

@Injectable()
export class TasksService {
  constructor(
    private monoService: MonoService,
    private usersService: UsersService,
    private ratesService: RatesService,
    private botService: BotService,
  ) {
    this.init();
  }
  private readonly logger = new Logger(TasksService.name);

  async init() {
    const last = await this.ratesService.getLast();
    if (!last) {
      for await (const item of TEMP_INITIAL_DATA) {
        const [dateString, rateBuy, rateSell] = item;

        await this.ratesService.add({
          date: new Date(dateString).valueOf(),
          rateBuy,
          rateSell,
        });
      }
    }
  }

  @Cron('0 */10 * * * *')
  async handleCron() {
    try {
      const [pair, last] = await Promise.all([
        this.monoService.getRates(),
        this.ratesService.getLast(),
      ]);
      if (!pair) return this.logger.warn('No data received');
      if (!last) return this.logger.warn('No last data');

      if (last.rateBuy === pair.rateBuy && last.rateSell === pair.rateSell) {
        this.logger.debug('Rates have not changed.');
      } else {
        await this.ratesService.add(pair);
        await this.notifyUsers(pair, last);
        this.logger.log(pairToText(pair));
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  async notifyUsers(last: RateDto, beforeLast: RateDto) {
    const users = await this.usersService.getSubscribed();
    const chatIds = users.map((user) => user.chatId);

    await this.botService.notifyRatesChanged(chatIds, last, beforeLast);
  }
}
