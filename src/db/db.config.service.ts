import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(DbConfigService.name);
  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      ...this.configService.get('dbOptions'),
      models: [User],
      logging: (log) => this.logger.verbose(log),
    };
  }
}
