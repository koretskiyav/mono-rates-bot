import { Injectable } from '@nestjs/common';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config';

@Injectable()
export class DbConfigService implements SequelizeOptionsFactory {
  constructor(private configService: ConfigService<AppConfig, true>) {}
  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      ...this.configService.get('dbOptions'),
      models: [User],
    };
  }
}
