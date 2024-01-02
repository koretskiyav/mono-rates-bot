import { Module } from '@nestjs/common';

import { MonoModule } from '../mono/mono.module';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';
import { RatesModule } from '../rates/rates.module';

@Module({
  imports: [MonoModule, UsersModule, RatesModule],
  providers: [TasksService],
})
export class TasksModule {}
