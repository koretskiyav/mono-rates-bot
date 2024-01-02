import { Currency } from '../../mono/interfaces/currency.interface';

export interface RateDto
  extends Pick<Currency, 'date' | 'rateSell' | 'rateBuy'> {}
