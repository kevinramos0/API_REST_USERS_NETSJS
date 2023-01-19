import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ProfileRols } from './profile-rols.entity';
import { ProfileModules } from './profile-module.entity';

@Entity({ name: 'mnt_profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
  })
  deletedAt?: Date;

  // profile to user
  @OneToMany(() => User, (user) => user.profile, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  }) // relacion bidireccional
  user: User[];

  // profile to rols
  @OneToMany(() => ProfileRols, (rol) => rol.profile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rols: ProfileRols[];

  // profile to modules
  @OneToMany(() => ProfileModules, (module) => module.profile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  modules: ProfileModules[];
}
