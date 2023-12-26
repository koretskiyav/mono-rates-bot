import { Injectable } from '@nestjs/common';

import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(chatId: number) {
    return this.userModel.create({ chatId });
  }

  async findByChatId(chatId: number) {
    return this.userModel.findOne({ where: { chatId } });
  }

  async subscribe(chatId: number) {
    const user = await this.userModel.findOne({ where: { chatId } });
    if (!user) {
      throw new Error('Not found');
    }
    user.subscribed = true;
    return user.save();
  }

  async unsubscribe(chatId: number) {
    const user = await this.userModel.findOne({ where: { chatId } });
    if (!user) {
      throw new Error('Not found');
    }
    user.subscribed = false;
    return user.save();
  }
}
