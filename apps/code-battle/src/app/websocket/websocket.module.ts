import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { environment } from '../../environments/environment';
import { WebsocketService } from './websocket.service';

const config: SocketIoConfig = { url: environment.WEBSOCKET_URL };

@NgModule({
  declarations: [],
  imports: [CommonModule, SocketIoModule.forRoot(config)],
  providers: [WebsocketService],
  exports: [SocketIoModule],
})
export class WebsocketModule {}
