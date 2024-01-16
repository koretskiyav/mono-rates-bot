import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { UsersModule } from '../users/users.module';
import { RatesModule } from '../rates/rates.module';

@Module({
  imports: [ConfigModule, UsersModule, RatesModule],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
