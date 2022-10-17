import { BaseUser } from '../../user';
import { ChallengeRoom } from './challenge-room.interface';

export interface Challenge {
  id: string;
  challengeRoom: ChallengeRoom;
  players: BaseUser[];
  winner: BaseUser;
  isChallengeStarted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
