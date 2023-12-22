import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { Currency } from './interfaces/currency.interface';

const API_PATH = 'https://api.monobank.ua/bank/currency';

const USD = 840;
const UAH = 980;

@Injectable()
export class MonoService {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(MonoService.name);

  async getRates(currA = USD, currB = UAH) {
    try {
      const rates = await this.httpService.axiosRef.get<Currency[]>(API_PATH);
      const pair = rates.data.find(
        (el) => el.currencyCodeA === currA && el.currencyCodeB === currB,
      );
      if (!pair) throw new Error(`Pair ${currA}/${currB} nor found.`);
      return pair;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
