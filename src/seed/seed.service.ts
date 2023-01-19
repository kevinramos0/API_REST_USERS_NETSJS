import { Inject, Injectable } from '@nestjs/common';
import { ProfilesService } from '../users/services/profiles.service';
import { RolsService } from '../users/services/rols.service';
import { initSeedData } from './data/seed.init';
import { Rol, User, Modules } from '../users/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModulesService } from '../users/services/modules.service';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly _userService: Repository<User>,
    @Inject(ProfilesService)
    private readonly _profileService: ProfilesService,
    @Inject(RolsService)
    private readonly _rolsService: RolsService,
    @Inject(ModulesService)
    private readonly _moduleService: ModulesService,
  ) {}

  async initSeed() {
    const searchUser = await this._userService.count();

    if (!searchUser) {
      const rol = await this.seedCreateRols();
      const modules = await this.seedCreateModules();
      const profile = await this.seedCreateProfile(rol, modules);
      const user = await this.seedCreateUser(profile.id);

      await Promise.all([rol, profile, user, modules]);

      return {
        message: 'SEED EXECUTED SUCCESSFULLY',
      };
    }
  }

  async seedCreateRols() {
    const seedRols = initSeedData.Rols;

    const rols: Rol[] = [];

    for (const rol of seedRols) {
      const saveRol = await this._rolsService.createRol(rol);

      rols.push(saveRol);
    }

    // return rol Admin
    return rols[0].id;
  }

  async seedCreateModules() {
    const seedModules = initSeedData.Modules;

    const modules: Modules[] = [];
    for (const module of seedModules) {
      const saveModule = await this._moduleService.create(module);
      modules.push(saveModule);
    }

    return modules.map((p) => p.id);
  }

  async seedCreateProfile(rol: number, modules: number[]) {
    const seedProfile = initSeedData.Profile;
    console.log(rol, modules);

    const profile = await this._profileService.createProfile({
      ...seedProfile,
      rols: [rol],
      modules,
    });

    return profile;
  }

  async seedCreateUser(profile: number) {
    const seedUser = initSeedData.User;

    const user = this._userService.create({
      ...seedUser,
      profile: { id: profile },
    });

    await this._userService.save(user);

    return user;
  }
}
