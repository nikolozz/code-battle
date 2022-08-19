import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeRepository } from './challenge-room.repository';
import { ChallengeRoomService } from './challenge-room.service';
import { CHALLENGE_ROOM_REPOSIT0RY } from './constants';
import { ChallengeRoomEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengeRoomEntity])],
  providers: [
    ChallengeRoomService,
    { provide: CHALLENGE_ROOM_REPOSIT0RY, useClass: ChallengeRepository },
  ],
  exports: [ChallengeRoomService],
})
export class ChallengeLibModule {}
