import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileRols, Profile } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProfileRolsService {
  constructor(
    @InjectRepository(ProfileRols)
    private readonly _profileRolsRepository: Repository<ProfileRols>,
    private readonly _dataSource: DataSource,
  ) {}

  async addRolsToProfile(rols: number[], profile: Profile) {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // add rols to profile
      console.error('00000000000000');
      for (const rol of rols) {
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(ProfileRols)
          .values({ profile, rol: { id: rol } })
          .execute();
      }
      // commit transaction now:
      await queryRunner.commitTransaction();

      //rolls all changes
    } catch (err) {
      console.error('1111');
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);

      // finish transaction
    } finally {
      await queryRunner.release();
    }
  }

  async deleteRolsToProfile(profile: Profile) {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // delete all rols to profile
      await queryRunner.manager.delete(ProfileRols, {
        profile,
      });

      // commit transaction now:
      await queryRunner.commitTransaction();

      //rolls all changes
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);

      // finish transaction
    } finally {
      await queryRunner.release();
    }
  }

  // async findAllRolsOneProfile(idProfile: number) {
  //   const rols = await this._profileRolsRepository
  //     .createQueryBuilder('rols')
  //     .leftJoinAndSelect('rols.profile', 'profile')
  //     .where('profile.id = :idProfile', { idProfile })
  //     .leftJoinAndSelect('rols.rol', 'rol')
  //     .select(['rols.rol', 'rol.id', 'rol.name'])
  //     .getMany();

  //   return rols.filter((rols) => !!rols).map((name) => name.rol);
  // }
}
