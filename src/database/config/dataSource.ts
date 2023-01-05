import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  database: configService.get('DB_DATABASE'),
  port: configService.get('DB_PORT'),
  password: configService.get('DB_PASSWORD'),
  username: configService.get('DB_USERNAME'),
  host: configService.get('DB_HOST'),
  logging: !!configService.get('DB_LOGGIN') === true,
  synchronize: !!configService.get('DB_SYNCHRONIZE') === true,
  entities: ['src/**/*.entity{.ts, .js}'],
  migrationsRun: true,
  migrations: ['src/database/migrations/*.ts'],
});
