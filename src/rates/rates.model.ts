import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Unique,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'rates', timestamps: false })
export class Rate extends Model {
  @Unique @PrimaryKey @Column date!: Date;
  @Column({ type: DataType.FLOAT }) rateBuy!: number;
  @Column({ type: DataType.FLOAT }) rateSell!: number;
}
