import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UiModule } from '@code-battle/ui';
import { WebsocketModule } from '../websocket/websocket.module';

import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, UiModule, WebsocketModule, HttpClientModule],
})
export class HomeModule {}
