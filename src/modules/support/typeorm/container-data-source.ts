import { DataSource, type DataSourceOptions } from 'typeorm';
import { Entities } from './entities';
import { Migrations } from './migrations';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'tellus',
  password: 'tellus123',
  database: 'tellus_db',
  synchronize: false,
  logging: false,
  entities: Entities,
  migrations: Migrations,
};

export const LocalDataSource = new DataSource(dataSourceOptions);
