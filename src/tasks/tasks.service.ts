import { isEqual } from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Currency } from 'src/mono/interfaces/currency.interface';
import { MonoService } from 'src/mono/mono.service';

@Injectable()
export class TasksService {
  constructor(private monoService: MonoService) {}
  private readonly logger = new Logger(TasksService.name);

  lastRates: Currency | undefined;

  @Cron('0 */10 * * * *')
  async handleCron() {
    try {
      const pair = await this.monoService.getRates();
      if (!pair) return this.logger.warn('No data received');

      if (this.lastRates && isEqual(this.lastRates, pair)) {
        this.logger.debug('Rates have not changed.');
      } else {
        this.lastRates = pair;
        this.logger.log(pairToText(pair));
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}

function formatDateTime(timestamp: number) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Date(timestamp).toLocaleString('en-GB', options);
}

function pairToText(data: Currency) {
  const { date: unixSec, rateBuy, rateSell } = data;
  const date = formatDateTime(unixSec * 1000);

  return `Rates changed at ${date} to ${rateBuy}/${rateSell}`;
}
