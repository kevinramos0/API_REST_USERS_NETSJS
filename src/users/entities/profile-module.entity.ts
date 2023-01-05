import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Modules } from './modules.entity';
import { Profile } from './profile.entity';

@Entity({ name: 'mnt_profile_modules' })
export class ProfileModules {
  @PrimaryColumn('int4', { name: 'id_profile' })
  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'id_profile' })
  profile: Profile;

  @PrimaryColumn('int4', { name: 'id_module' })
  @ManyToOne(() => Modules, (module: Modules) => module.moduleProfile)
  @JoinColumn({ name: 'id_module' })
  module: Modules;
}
