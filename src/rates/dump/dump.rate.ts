import { RateDto } from '../dto/rate.dto';
import { Rate } from '../rates.model';

export function dumpRate(rate: Rate): RateDto {
  return {
    date: rate.date.valueOf(),
    rateBuy: rate.rateBuy,
    rateSell: rate.rateSell,
  };
}
