import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MonoService } from '../mono/mono.service';
import { RatesService } from '../rates/rates.service';
import { UsersService } from '../users/users.service';
import { BotService } from '../bot/bot.service';

import { RateDto } from '../rates/dto/rate.dto';
import { pairToText } from '../utils/pairToText';

@Injectable()
export class TasksService {
  constructor(
    private monoService: MonoService,
    private usersService: UsersService,
    private ratesService: RatesService,
    private botService: BotService,
  ) {}
  private readonly logger = new Logger(TasksService.name);

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
