import { ChallengeCreate, ChallengeRoom } from '@code-battle/common';

export interface ChallengeRoomRepository {
  getActiveRooms(): Promise<ChallengeRoom[]>;
  createRoom(userId: number, room: ChallengeCreate): Promise<ChallengeRoom>;
}
