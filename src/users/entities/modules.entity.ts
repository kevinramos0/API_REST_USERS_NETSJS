import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileModules } from './profile-module.entity';

@Entity({ name: 'mnt_modules' })
export class Modules {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column({ name: 'name_ruta', type: 'varchar' })
  nameRoute: string;

  @Column('varchar', { length: 250, nullable: true })
  description: string;

  @Column('varchar')
  icon: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic: boolean;

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

  @OneToMany(
    () => ProfileModules,
    (modules: ProfileModules) => modules.module,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  moduleProfile: ProfileModules[];
}
