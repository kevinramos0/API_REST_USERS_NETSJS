import * as moment from 'moment-timezone';
import {
  FindOptionsWhere,
  ILike,
  Repository,
  FindManyOptions,
  DataSource,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Profile, ProfileModules, Modules } from '../entities';
import {
  CreateModuleDto,
  FindModuleDto,
  UpdateModuleDto,
} from '../dto/module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Modules)
    private readonly _moduleRepository: Repository<Modules>,
    private readonly _dataSource: DataSource,
  ) {}

  async findAll(payloadUpdateModule: FindModuleDto) {
    const { limit = 10, offset = 1, pagination = true } = payloadUpdateModule;
    const { name, active = true } = payloadUpdateModule;
    const findOptions: FindManyOptions<Modules> = {};
    const where: FindOptionsWhere<Modules> = {};

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
    const [modules, total] = await this._moduleRepository.findAndCount(
      findOptions,
    );
    return {
      modules,
      pagination: {
        limit: pagination ? limit : total,
        offset: pagination ? limit : 1,
        total,
      },
    };
  }

  async findByPk(id: number) {
    const module = await this._moduleRepository.findOneBy({ id });

    if (!module) throw new NotFoundException(`No found module with id ${id}`);
  }

  async findOne(id: number) {
    await this.findByPk(id);

    const module = await this._moduleRepository.findOne({
      where: { id },
      select: { moduleProfile: false },
    });

    return module;
  }

  async create(paylodCreateModule: CreateModuleDto) {
    const module = this._moduleRepository.create({
      createdAt: moment().tz('America/El_Salvador').format(),
      ...paylodCreateModule,
    });

    await this._moduleRepository.save(module);

    return module;
  }

  async update(id: number, payloadFindModule: UpdateModuleDto) {
    await this.findByPk(id);

    const module = await this._moduleRepository.preload({
      id,
      updateAt: moment().tz('America/El_Salvador').format(),
      ...payloadFindModule,
    });
    await this._moduleRepository.save(module);

    return module;
  }

  async delete(id: number) {
    await this.findByPk(id);

    const deleteModule = await this._moduleRepository.softDelete(id);

    if (!deleteModule.affected) throw new ConflictException();

    return {
      message: 'Module deleted successfully',
    };
  }

  async restore(id: number) {
    const restoreModule = await this._moduleRepository.restore(id);

    if (!restoreModule.affected) throw new ConflictException();

    return {
      message: 'Module restore successfully',
    };
  }

  async addToProfile(modules: number[], profile: Profile) {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // add rols to profile
      for (const module of modules) {
        await this.findByPk(module); //search if exist module
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(ProfileModules)
          .values({ profile: profile, module: { id: module } })
          .execute();
      }
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

  async deteleToProfile(profile: Profile) {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // delete module
      await queryRunner.manager.delete(ProfileModules, {
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
}
