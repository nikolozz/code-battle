import { ChallengeRoomCreate, ChallengeRoom } from '@code-battle/common';
import { GetActiveRooms } from './get-active-rooms.interface';

export interface ChallengeRoomRepository {
  getActiveRooms(options?: Partial<GetActiveRooms>): Promise<ChallengeRoom[]>;
  createRoom(userId: number, room: ChallengeRoomCreate): Promise<ChallengeRoom>;
  markRoomAsInactive(roomId: string): Promise<number>;
}
