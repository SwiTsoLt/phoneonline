import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebRtcService } from './webrtc.service';
import { WebSocketService } from './ws.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    WebSocketService,
    WebRtcService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
