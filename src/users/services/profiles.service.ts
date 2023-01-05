import * as moment from 'moment-timezone';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Inject,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import {
  Repository,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  DataSource,
} from 'typeorm';

import { ModulesService } from './modules.service';
import { ProfileRolsService } from './profileRols.service';
import { RolsService } from './rols.service';
import { Profile } from '../entities';

import {
  CreateProfileDto,
  searchProfileDTO,
  UpdateProfileDto,
} from '../dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly _profileRepository: Repository<Profile>,
    @Inject(RolsService)
    private readonly _rolRepository: RolsService,
    @Inject(ProfileRolsService)
    private readonly _profileRolsRepository: ProfileRolsService,
    @Inject(ModulesService)
    private readonly _moduleRepository: ModulesService,
    private readonly _dataSource: DataSource,
  ) {}

  async findAllProfiles(params: searchProfileDTO): Promise<{
    profiles: Profile[];
    total: number;
  }> {
    const { limit = 10, offset = 1, pagination = true } = params; // params for pagination
    const { name } = params; // params for filter

    const findOptions: FindManyOptions<Profile> = {};
    const where: FindOptionsWhere<Profile> = {};

    if (name) where.name = ILike(`%${name || ''}%`);
    // if (is_active) where.firstName = Like(`%${firstName || ''}%`);
    if (pagination) {
      findOptions.take = limit;
      findOptions.skip = limit * (offset - 1);
    }

    findOptions.where = where;
    // findOptions.relations = { user: true };
    findOptions.order = { name: 'ASC' };

    // search normal
    const [profiles, total] = await this._profileRepository.findAndCount(
      findOptions,
    );

    return { profiles, total };
  }

  async findOneProfile(id: number): Promise<Profile> {
    const profile = await this._profileRepository.findOne({
      where: { id },
      relations: { rols: { rol: true }, modules: { module: true } },
      select: {
        rols: { rol: { id: true, name: true } },
        modules: { module: { id: true, name: true } },
      },
    });
    if (!profile)
      throw new BadRequestException(`Profile with id ${id} not found`);
    return profile;
  }

  async getRolsToProfile(id: number) {
    const profile = await this.findOneProfile(id);
    const rols = await this._profileRolsRepository.findAllRolsOneProfile(
      profile.id,
    );
    return {
      profile,
      rols,
    };
  }

  async createProfile(profileDto: CreateProfileDto) {
    const { rols, ...profileData } = profileDto;

    // valid that exist all rols
    if (rols) {
      for (const rol of rols) {
        await this._rolRepository.getOneRol(rol);
      }
    }

    // create object in memory
    const profile = this._profileRepository.create({
      ...profileData,
      createAt: moment().tz('America/El_Salvador').format(),
    });

    await this._profileRepository.save(profile);

    // add rols to profile
    if (rols)
      await this._profileRolsRepository.addRolsToProfile(
        [...new Set(rols)], // delete duplicate ids
        profile,
      );

    return profile;
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const { rols, ...profileData } = updateProfileDto;

    await this.findOneProfile(id);
    const profile = await this._profileRepository.preload({
      id,
      updateAt: moment().tz('America/El_Salvador').format(),
      ...profileData,
    });

    if (rols) {
      for (const rol of rols) {
        await this._rolRepository.getOneRol(rol);
      }
      //delete all rols to profile
      await this._profileRolsRepository.deleteRolsToProfile(profile);

      //add all new rols
      await this._profileRolsRepository.addRolsToProfile(
        [...new Set(rols)], // delete duplicate ids
        profile,
      );
    }
    await this._profileRepository.save(profile);
    return profile;
  }

  /** @deprecated never used */
  async deleteProfileOld(id: number) {
    await this.findOneProfile(id);
    const profile = await this._profileRepository.preload({
      id,
      isActive: false,
      updateAt: moment().tz('America/El_Salvador').format(),
    });
    await this._profileRepository.save(profile);
    // await this._profileRepository.delete(id);
    return { message: 'Profile deleted successfully' };
  }

  async deleteProfile(id: number) {
    await this.findOneProfile(id);
    await this._profileRepository.softDelete(id);
    return { message: 'Profile deleted successfully' };
  }

  async restoreProfile(id: number) {
    const profile = await this._profileRepository.restore(id);
    if (!profile.affected) throw new ConflictException();
    return profile;
  }

  async getModulesProfile(idProfile: number) {
    await this.findOneProfile(idProfile);
    const modules = await this._profileRepository
      .createQueryBuilder('profile')
      .innerJoin('profile.modules', 'moduleProfile')
      .innerJoin('moduleProfile.module', 'module')
      .where('profile.id =:idProfile', { idProfile })
      .select([
        'profile.id',
        'profile.name',
        'moduleProfile.module',
        'module.id',
        'module.name',
      ])
      .getOne();

    return modules;
  }

  /** ADD MODULES */
  async addModulesToProfile(id: number, modules: number[]) {
    const profile = await this.findOneProfile(id);

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // add modules to profile
      await this._moduleRepository.addToProfile(
        [...new Set(modules)],
        profile,
        queryRunner,
      );
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

    return {
      message: 'Modules add successfully',
    };
  }

  async deleteModuleProfile(id: number, module: number) {
    const profile = await this.findOneProfile(id);
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //  delete module
      await this._moduleRepository.deteleToProfile(
        module,
        profile,
        queryRunner,
      );
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

    return {
      message: 'Module delete successfully',
    };
  }
}
