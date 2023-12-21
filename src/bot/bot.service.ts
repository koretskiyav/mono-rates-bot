import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {
  getBot(): string {
    return 'BotService and BotModule works!';
  }
}
