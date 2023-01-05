import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'mnt_refresh_token' })
export class refreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'refresh_token', type: 'text' })
  refreshToken: string;

  @Column({ name: 'date_valid', type: 'timestamptz' })
  dateValid: Date;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'id_user',
    foreignKeyConstraintName: 'fk_mnt_user_refresh_token',
  })
  user: User;
}
