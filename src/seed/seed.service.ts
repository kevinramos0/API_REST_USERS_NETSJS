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
      const profile = await this.seedCreateProfile();
      const user = await this.seedCreateUser(profile.id);
      const modules = await this.seedCreateModules();

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

    return rols[0];
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

  async seedCreateProfile() {
    const seedProfile = initSeedData.Profile;

    const profile = await this._profileService.createProfile(seedProfile);

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
