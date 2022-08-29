import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { WebsocketService } from './websocket.service';

// TODO change to factory method
const config: SocketIoConfig = { url: 'http://localhost:4445' };

@NgModule({
  imports: [CommonModule, SocketIoModule.forRoot(config)],
  providers: [WebsocketService],
  exports: [SocketIoModule],
})
export class UiWebsocketModule {}
