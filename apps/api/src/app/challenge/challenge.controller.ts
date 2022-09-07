import { ChallengeService } from '@code-battle/challenge';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../interfaces';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  public joinChallenge(
    @Param('id') roomId: string,
    @Req() request: RequestWithUser
  ): Promise<boolean> {
    return this.challengeService.joinChallenge(request.user.id, roomId);
  }
}
