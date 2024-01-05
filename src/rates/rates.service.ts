import { Injectable } from '@nestjs/common';

import { Rate } from './rates.model';
import { InjectModel } from '@nestjs/sequelize';
import { RateDto } from './dto/rate.dto';
import { dumpRate } from './dump/dump.rate';

@Injectable()
export class RatesService {
  constructor(
    @InjectModel(Rate)
    private rateModel: typeof Rate,
  ) {}

  async add(rate: RateDto) {
    return dumpRate(await this.rateModel.create(rate));
  }

  async getLast(offset = 0) {
    const rate = await this.rateModel.findOne({
      offset,
      order: [['date', 'DESC']],
    });
    return rate && dumpRate(rate);
  }
}
