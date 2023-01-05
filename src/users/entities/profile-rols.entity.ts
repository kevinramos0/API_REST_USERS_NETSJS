import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Rol } from './rol.entity';

@Entity({ name: 'mnt_profile_rols' })
export class ProfileRols {
  @PrimaryColumn('int4', { name: 'id_profile' })
  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'id_profile' })
  profile: Profile;

  @PrimaryColumn('int4', { name: 'id_rol' })
  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;
}
