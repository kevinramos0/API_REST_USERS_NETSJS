import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileRols } from './profile-rols.entity';

@Entity({ name: 'mnt_rols' })
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
  })
  updateAt: Date;

  @DeleteDateColumn({
    name: 'delete_at',
    type: 'timestamptz',
  })
  deleteAt?: Date;

  // relacion a tabla personalizada
  @OneToMany(() => ProfileRols, (rol: ProfileRols) => rol.rol, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  rolProfile: ProfileRols[];

  // relacion a Users generada automaticamente una tabla terniaria (user-Rol)
  // @ManyToMany(() => User, (user) => user.rols)
  // @JoinTable({
  //   name: 'mnt_user_rols',
  //   joinColumn: {
  //     name: 'id_rol',
  //     foreignKeyConstraintName: 'fk_rol_userRol',
  //   },
  //   inverseJoinColumn: {
  //     name: 'id_user',
  //     foreignKeyConstraintName: 'fk_user_userRol',
  //   },
  // })
  // users: User[];
}
