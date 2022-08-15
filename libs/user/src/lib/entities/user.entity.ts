import { User as BaseUser } from '@code-battle/api-types';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../enums';


export type DBUser = Omit<BaseUser, 'id'> & {
  roles: Roles[];
  hashedRefreshToken?: string;
};

export type RegisterUser = Omit<BaseUser, 'id'> & { repeatPassword: string };

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

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  public hashedRefreshToken?: string | null;
}

export default UserEntity;
