import { Inject, Injectable } from '@nestjs/common';
import { ProfilesService } from '../users/services/profiles.service';
import { RolsService } from '../users/services/rols.service';
import { initSeedData } from './data/seed.init';
import { Profile, Rol, User, Modules, ProfileModules } from '../users/entities';
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
    @InjectRepository(ProfileModules)
    private readonly _profileModuleService: Repository<ProfileModules>,
  ) {}

  async initSeed() {
    const searchUser = await this._userService.count();

    if (!searchUser) {
      const rol = await this.seedCreateRols();
      const profile = await this.seedCreateProfile();
      const user = await this.seedCreateUser(profile);
      const modules = await this.seedCreateModules();
      const addModulesToProfile = await this.seedAddModulesToProfile(
        profile,
        modules,
      );

      await Promise.all([rol, profile, user, modules, addModulesToProfile]);

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

  async seedCreateProfile() {
    const seedProfile = initSeedData.Profile;

    const profile = await this._profileService.createProfile(seedProfile);

    return profile;
  }

  async seedCreateUser(profile: Profile) {
    const seedUser = initSeedData.User;

    const user = this._userService.create(seedUser);
    user.profile = profile;

    await this._userService.save(user);

    return user;
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

  async seedAddModulesToProfile(profile: Profile, modules: number[]) {
    for (const module of modules) {
      await this._profileModuleService
        .createQueryBuilder()
        .insert()
        .into(ProfileModules)
        .values({ profile: profile, module: { id: module } })
        .execute();
    }
  }
}
