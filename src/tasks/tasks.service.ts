import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 */10 * * * *')
  handleCron() {
    this.logger.debug('Called every 10 minutes');
  }
}
