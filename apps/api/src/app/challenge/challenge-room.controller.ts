import { ChallengeRoomService } from '@code-battle/challenge';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../interfaces';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@Controller('challenge-room')
export class ChallengeRoomController {
  constructor(private readonly challengeRoomService: ChallengeRoomService) {}

  @Get()
  public getChallengeRooms() {
    return this.challengeRoomService.getActiveRooms();
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'))
  public createChallengeRoom(
    @Body() createRoom: CreateChallengeDto,
    @Req() request: RequestWithUser
  ) {
    return this.challengeRoomService.createRoom(request.user.id, createRoom);
  }
}
