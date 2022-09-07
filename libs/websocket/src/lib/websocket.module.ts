import { AuthLibModule } from '@code-battle/auth';
import { Module } from '@nestjs/common';

import { WebSocketService } from './websocket.service';

@Module({
  imports: [AuthLibModule],
  providers: [WebSocketService],
  exports: [WebSocketService],
})
export class WebsocketModule {}
