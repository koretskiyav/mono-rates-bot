import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MonoService } from '../mono/mono.service';
import { RatesService } from '../rates/rates.service';

import { RateDto } from 'src/rates/dto/rate.dto';

@Injectable()
export class TasksService {
  constructor(
    private monoService: MonoService,
    private ratesService: RatesService,
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

      if (
        last &&
        last.rateBuy === pair.rateBuy &&
        last.rateSell === pair.rateSell
      ) {
        this.logger.debug('Rates have not changed.');
      } else {
        await this.ratesService.add(pair);
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

function pairToText(data: RateDto) {
  const { date, rateBuy, rateSell } = data;
  return `Rates changed at ${formatDateTime(date)} to ${rateBuy}/${rateSell}`;
}
