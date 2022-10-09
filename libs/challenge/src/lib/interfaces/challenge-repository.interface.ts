import { Challenge, CreateChallenge } from '@code-battle/common';

export interface ChallengeRepository {
  getChallenge(id: string): Promise<Challenge>;
  getChallengeByRoomId(id: string): Promise<Challenge>;
  getChallengeByUser(id: number): Promise<Challenge>;
  createChallenge(createChallenge: CreateChallenge): Promise<Challenge>;
  addPlayerToChallenge(userId: number, challengeId: string): Promise<number>;
}
