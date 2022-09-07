import { Challenge, User as BaseUser } from '@code-battle/common';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Min } from 'class-validator';
import { Roles } from '../enums';

export type DBUser = Omit<BaseUser, 'id'> & {
  roles: Roles[];
  hashedRefreshToken?: string;
  rank?: number;
};

@Entity({ name: 'users' })
class UserEntity implements DBUser {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, type: 'varchar' })
  public email: string;

  @Column({ unique: true, type: 'varchar' })
  public username: string;

  @Column({ type: 'varchar' })
  @Exclude()
  public password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.User })
  @Exclude()
  public roles: Roles[];

  @Column({ type: 'int', default: 1000 })
  @Min(0)
  public rank: number;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  public hashedRefreshToken?: string | null;

  @ManyToMany('ChallengeEntity', 'players', { nullable: true })
  public challenges: Challenge[];
}

export default UserEntity;
