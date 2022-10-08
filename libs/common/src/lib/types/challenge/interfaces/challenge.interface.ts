import { BaseUser } from '../../user';
import { ChallengeRoom } from './challenge-room.interface';

export interface Challenge {
  id: string;
  challengeRoom: ChallengeRoom;
  players: BaseUser[];
  winner: BaseUser;
  winnerId: number;
  createdAt: Date;
  updatedAt: Date;
}
