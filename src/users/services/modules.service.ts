import * as moment from 'moment-timezone';
import { FindOptionsWhere, ILike, Repository, QueryRunner } from 'typeorm';
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
  ) {}

  async findAll(payloadUpdateModule: FindModuleDto) {
    const { name, isActive = true } = payloadUpdateModule;
    const whereOption: FindOptionsWhere<Modules> = {};

    if (name) whereOption.name = ILike(`%${name || ''}%`);
    whereOption.isActive = isActive;

    const modules = await this._moduleRepository.find({
      where: whereOption,
      select: { id: true, name: true, description: true, isActive: true },
    });

    return modules;
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

  async addToProfile(
    modules: number[],
    profile: Profile,
    queryRunner: QueryRunner,
  ) {
    try {
      for (const module of modules) {
        await this.findByPk(module); //search if exist module
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(ProfileModules)
          .values({ profile: profile, module: { id: module } })
          .execute();
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deteleToProfile(
    module: number,
    profile: Profile,
    queryRunner: QueryRunner,
  ) {
    try {
      await this.findByPk(module); //search if exist module

      // delete module
      await queryRunner.manager.delete(ProfileModules, {
        profile,
        module: { id: module },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
