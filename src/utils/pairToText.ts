import { RateDto } from '../rates/dto/rate.dto';
import { formatDateTime } from './formatters';

export function pairToText(data: RateDto) {
  const { date, rateBuy, rateSell } = data;
  return `Rates changed at ${formatDateTime(date)} to ${rateBuy}/${rateSell}`;
}
