import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';
import { MainSeeder } from '../seeds/Main.seeder';

config();
const configService = new ConfigService();
const dataSource: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  database: configService.get('DB_DATABASE'),
  port: configService.get('DB_PORT'),
  password: configService.get('DB_PASSWORD'),
  username: configService.get('DB_USERNAME'),
  host: configService.get('DB_HOST'),
  logging: !!configService.get('DB_LOGGIN') === true,
  synchronize: !!configService.get('DB_SYNCHRONIZE') === true,
  entities: [__dirname + '/../../**/*.entity.{js,ts}'],
  migrationsRun: true,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  seeds: [MainSeeder],
};

export default new DataSource(dataSource);
