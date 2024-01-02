import { Module } from '@nestjs/common';

import { RatesService } from './rates.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rate } from './rates.model';

@Module({
  imports: [SequelizeModule.forFeature([Rate])],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
