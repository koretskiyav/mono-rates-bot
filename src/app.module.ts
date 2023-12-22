import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { BotModule } from './bot/bot.module';
import { config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    ScheduleModule.forRoot(),
    TasksModule,
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
