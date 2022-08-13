import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';

import { UiModule } from '@code-battle/ui';

import { WebsocketModule } from '../websocket/websocket.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, UiModule, WebsocketModule],
})
export class HomeModule {}
