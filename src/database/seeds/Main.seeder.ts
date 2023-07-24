import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import { InitSeeder } from './factories/users';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, InitSeeder);
  }
}
