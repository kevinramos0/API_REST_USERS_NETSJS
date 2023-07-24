import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import {
  Rol,
  Modules,
  Profile,
  User,
  ProfileRols,
  ProfileModules,
} from '../../../users/entities/index';
import { initSeedData } from '../data/initData';
import { BadRequestException } from '@nestjs/common';

export class InitSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create Rols
      const rols = initSeedData.Rols;
      const rolsCreated: Rol[] = [];
      for (const rol of rols) {
        const newRol = queryRunner.manager.create(Rol, {
          ...rol,
        });
        await queryRunner.manager.save(newRol);

        rolsCreated.push(newRol);
      }

      // Create Modules
      const modules = initSeedData.Modules;
      const modulesCreated: Modules[] = [];
      for (const module of modules) {
        const newModule = queryRunner.manager.create(Modules, {
          ...module,
        });
        await queryRunner.manager.save(newModule);

        modulesCreated.push(newModule);
      }
      // Create Profile
      const createprofile = initSeedData.Profile;
      const newProfile = queryRunner.manager.create(Profile, {
        ...createprofile,
      });
      const profile = await queryRunner.manager.save(newProfile);

      // Assing rols to profile
      for (const rol of rolsCreated) {
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(ProfileRols)
          .values({ profile: { id: profile.id }, rol: { id: rol.id } })
          .execute();
      }

      for (const module of modulesCreated) {
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(ProfileModules)
          .values({ profile: { id: profile.id }, module: { id: module.id } })
          .execute();
      }

      // Create Modules
      const user = initSeedData.User;
      const newUser = queryRunner.manager.create(User, {
        profile: { id: profile.id },
        ...user,
      });
      await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('ERORRRRR', error);
    } finally {
      await queryRunner.release();
    }
  }
}
