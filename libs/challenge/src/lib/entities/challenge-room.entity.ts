import {
  BaseUser,
  ChallengeDuration,
  ChallengeLevel,
  ChallengeRoom,
} from '@code-battle/common';
import { UserEntity } from '@code-battle/user';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChallengeRoomEntity implements ChallengeRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO move as table
  @Column('enum', {
    enum: ChallengeDuration,
  })
  duration: ChallengeDuration;

  // TODO move as table
  @Column('enum', { enum: ChallengeLevel })
  level: ChallengeLevel;

  @OneToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn()
  createdBy: BaseUser;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  isPrivate: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
