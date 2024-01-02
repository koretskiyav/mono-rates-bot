import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { BotModule } from './bot/bot.module';
import { MonoModule } from './mono/mono.module';

import { config } from './config';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    DbModule,
    ScheduleModule.forRoot(),
    MonoModule,
    TasksModule,
    BotModule,
    UsersModule,
    RatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
