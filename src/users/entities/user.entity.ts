import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { refreshToken } from './refreshToken.entity';

@Entity({ name: 'mnt_users' })
export class User {
  [x: string]: unknown;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'email', type: 'varchar', length: 320 })
  email: string;

  @Column({ name: 'password', type: 'text', select: false })
  password: string;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('boolean', { name: 'is_verified', default: false })
  isVerified: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

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

  // relacion bidireccional
  @ManyToOne(() => Profile, (profile) => profile.user)
  // indica que esta es la tabla hijo (un usuario tiene un perfil)
  @JoinColumn({
    name: 'id_profile',
    foreignKeyConstraintName: 'fk_mnt_user_profile',
  })
  profile?: Profile;

  @OneToMany(() => refreshToken, (refreshToken) => refreshToken.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  refreshToken?: refreshToken[];

  // @BeforeInsert() async hashPassword() {
  //   this.password = await bcrypt.hash(this.password, 10);
  // }
  // @BeforeInsert()
  // emailInsert() {
  //   this.email = this.email.toLowerCase();
  // }

  // @BeforeUpdate()
  // emailUpdate() {
  //   this.email = this.email.toLowerCase();
  // }
}
