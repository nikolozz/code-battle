import { BaseUser, Challenge } from '@code-battle/common';
import { UserEntity } from '@code-battle/user';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChallengeRoomEntity } from './challenge-room.entity';

@Entity('challenge')
export class ChallengeEntity implements Challenge {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'uuid', nullable: true })
  challengeRoomId: string;

  @OneToOne(
    () => ChallengeRoomEntity,
    (challengeRoom) => challengeRoom.challenge
  )
  @JoinColumn()
  public challengeRoom: ChallengeRoomEntity;

  @OneToMany('UserEntity', 'challenges', { eager: true, cascade: ['update'] })
  @JoinTable()
  public players: BaseUser[];

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'winnerId' })
  public winner: BaseUser;

  @Column({ type: 'int', nullable: true })
  public winnerId: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
