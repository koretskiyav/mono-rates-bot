import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
