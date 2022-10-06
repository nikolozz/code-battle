import { Challenge, CreateChallenge } from '@code-battle/common';

export interface ChallengeRepository {
  getChallenge(id: string): Promise<Challenge>;
  getChallengeByRoomId(id: string, active?: boolean): Promise<Challenge>;
  createChallenge(createChallenge: CreateChallenge): Promise<Challenge>;
  addPlayerToChallenge(userId: number, challengeId: string): Promise<number>;
}
