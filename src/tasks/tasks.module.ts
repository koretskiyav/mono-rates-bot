import { Module } from '@nestjs/common';

import { MonoModule } from '../mono/mono.module';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';
import { RatesModule } from '../rates/rates.module';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [MonoModule, UsersModule, RatesModule, BotModule],
  providers: [TasksService],
})
export class TasksModule {}
