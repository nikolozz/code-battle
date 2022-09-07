import { BaseUser } from '../../user';

export interface CreateChallenge {
  challengeRoomId: string;
  players: Array<Partial<BaseUser>>;
}
