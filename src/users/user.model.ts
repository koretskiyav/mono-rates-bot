import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  Unique,
} from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model {
  @AutoIncrement @Unique @PrimaryKey @Column id!: number;
  @Unique @Column chatId!: number;
  @Column username?: string;
  @Column firstName?: string;
  @Column lastName?: string;
  @Column subscribed: boolean = false;
}
