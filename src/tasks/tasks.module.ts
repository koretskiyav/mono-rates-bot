import { Module } from '@nestjs/common';

import { MonoModule } from '../mono/mono.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [MonoModule],
  providers: [TasksService],
})
export class TasksModule {}
