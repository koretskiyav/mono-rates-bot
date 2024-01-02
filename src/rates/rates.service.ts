import { Injectable } from '@nestjs/common';

import { Rate } from './rates.model';
import { InjectModel } from '@nestjs/sequelize';
import { RateDto } from './dto/rate.dto';

@Injectable()
export class RatesService {
  constructor(
    @InjectModel(Rate)
    private rateModel: typeof Rate,
  ) {}

  async add(rate: RateDto) {
    return this.rateModel.create(rate);
  }

  async getLast() {
    return this.rateModel.findOne({ order: [['date', 'DESC']] });
  }
}
