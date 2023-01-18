import * as moment from 'moment-timezone';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Inject,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { Repository, FindManyOptions, FindOptionsWhere, ILike } from 'typeorm';

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
  ) {}

  async findAllProfiles(params: searchProfileDTO) {
    const { limit = 10, offset = 1, pagination = true } = params; // params for pagination
    const { name, active } = params; // params for filter

    const findOptions: FindManyOptions<Profile> = {};
    const where: FindOptionsWhere<Profile> = {};

    if (name) where.name = ILike(`%${name || ''}%`);
    if (active !== undefined) where.isActive = active;

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
    return {
      profiles,
      pagination: {
        limit: pagination ? limit : total,
        offset: pagination ? limit : 1,
        total,
      },
    };
  }

  async findOneProfile(id: number) {
    // const profiles = await this._profileRepository
    //   .createQueryBuilder('profile')
    //   .leftJoin('profile.rols', 'rols')
    //   .leftJoin('rols.rol', 'rol')
    //   .leftJoin('profile.modules', 'modules')
    //   .leftJoin('modules.module', 'module')
    //   .where('profile.id =:id', { id })
    //   .select(['profile', 'rol.id', 'rol.name'])
    //   .getOne();
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
    return {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      isActive: profile.isActive,
      createAt: profile.createAt,
      updateAt: profile.updateAt,
      deleteAt: profile.deleteAt,
      rols: profile.rols.map((rols) => rols.rol),
      modules: profile.modules.map((modules) => modules.module),
    };
  }

  async createProfile(profileDto: CreateProfileDto) {
    const { rols, modules, ...profileData } = profileDto;

    // valid that exist all rols
    if (rols) {
      for (const rol of rols) {
        await this._rolRepository.getOneRol(rol);
      }
    }

    // valid that exist all modules
    if (modules) {
      for (const rol of rols) {
        await this._moduleRepository.findByPk(rol);
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

    if (modules)
      await this._moduleRepository.addToProfile(
        [...new Set(modules)], // delete duplicate ids
        profile,
      );

    const newProfile = await this.findOneProfile(profile.id);
    return newProfile;
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    const { rols, modules, ...profileData } = updateProfileDto;

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

    if (modules) {
      for (const module of modules) {
        await this._moduleRepository.findByPk(module);
        //delete all rols to profile
      }
      await this._moduleRepository.deteleToProfile(profile);
      //add all new rols
      await this._moduleRepository.addToProfile(
        [...new Set(modules)], // delete duplicate ids
        profile,
      );
    }
    await this._profileRepository.save(profile);
    const dataProfile = await this.findOneProfile(id);
    return dataProfile;
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
}
