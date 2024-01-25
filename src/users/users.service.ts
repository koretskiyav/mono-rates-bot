import { Injectable } from '@nestjs/common';

import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getOrCreate(user: UserDto) {
    return (await this.findByChatId(user.chatId)) || (await this.create(user));
  }

  private async create(user: UserDto) {
    return this.userModel.create({ ...user });
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

  async getSubscribed() {
    return this.userModel.findAll({ where: { subscribed: true } });
  }
}
