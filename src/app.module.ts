import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { config } from './config';

@Module({
  imports: [ConfigModule.forRoot({ load: [config] }), BotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
