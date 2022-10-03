import {
  BaseUser,
  Challenge,
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
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChallengeEntity } from './challenge.entity';

@Entity()
export class ChallengeRoomEntity implements ChallengeRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO move as table
  @Column('enum', {
    enum: ChallengeDuration,
  })
  duration: ChallengeDuration;

  @Column({ type: 'uuid', nullable: true })
  challengeId: string;

  @OneToOne(() => ChallengeEntity, (challenge) => challenge.challengeRoom, {
    eager: true,
  })
  public challenge: Challenge;

  // TODO move as table
  @Column('enum', { enum: ChallengeLevel })
  level: ChallengeLevel;

  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn()
  createdBy: BaseUser;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  isPrivate: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
