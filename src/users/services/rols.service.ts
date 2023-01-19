import * as moment from 'moment-timezone';
import { Repository, FindOptionsWhere, FindManyOptions, ILike } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from '../entities';
import { CreateRolDto, SearchRolDto, UpdateRolDto } from '../dto/rol.dto';

@Injectable()
export class RolsService {
  constructor(
    @InjectRepository(Rol)
    private readonly _rolsRepository: Repository<Rol>,
  ) {}

  async getAllRols(searchRolDto: SearchRolDto) {
    const { limit = 10, offset = 1, pagination = true } = searchRolDto;
    const { name, active = true } = searchRolDto;

    const findOptions: FindManyOptions<Rol> = {};
    const where: FindOptionsWhere<Rol> = {};

    if (pagination) {
      findOptions.take = limit;
      findOptions.skip = limit * (offset - 1);
    }

    if (name) where.name = ILike(`%${name || ''}%`);
    if (active !== undefined) where.isActive = active;

    findOptions.where = where;
    findOptions.order = { name: 'ASC' };

    const [rols, count] = await this._rolsRepository.findAndCount(findOptions);
    return {
      rols,
      pagination: {
        limit: pagination ? limit : count,
        offset: pagination ? offset : 1,
        total: count,
      },
    };
  }

  async getOneRol(id: number): Promise<Rol> {
    const rol = await this._rolsRepository.findOneBy({ id });
    if (!rol) throw new NotFoundException(`Rol with id ${id} not found`);
    return rol;
  }

  async createRol(createRol: CreateRolDto): Promise<Rol> {
    const rol = this._rolsRepository.create({
      ...createRol,
      createdAt: moment().tz('America/El_Salvador').format(),
    });
    await this._rolsRepository.save(rol);
    return rol;
  }

  async updateRol(id: number, updateRol: UpdateRolDto): Promise<Rol> {
    await this.getOneRol(id);
    const rol = await this._rolsRepository.preload({
      id,
      updatedAt: moment().tz('America/El_Salvador').format(),
      ...updateRol,
    });
    await this._rolsRepository.save(rol);
    return rol;
  }

  /** @deprecated ya no se usa */
  async deleteRolOld(id: number) {
    await this.getOneRol(id);
    const rol = await this._rolsRepository.preload({
      id,
      isActive: false,
      updatedAt: moment().tz('America/El_Salvador').format(),
    });
    await this._rolsRepository.save(rol);
    return { message: 'Profile deleted successfully' };
  }

  async deleteRol(id: number) {
    await this.getOneRol(id);
    await this._rolsRepository.softDelete(id);
    return { message: 'Profile deleted successfully' };
  }

  async restoreRol(id: number) {
    const rol = await this._rolsRepository.restore(id);
    if (!rol.affected) throw new ConflictException();
    return rol;
  }
}
