import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NebularModule } from './nebular/nebular.module';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { SingOutComponent } from './components/sing-out/sing-out.component';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule } from 'ngx-socket-io';
import { UsersSocket } from './sockets/UsersSocket';
import { GamesSocket } from './sockets/GamesSocket';
import { RequestGameDialogComponent } from './components/request-game-dialog/request-game-dialog.component';

@NgModule({
  declarations: [AppComponent, SingOutComponent, RequestGameDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NebularModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
    SocketIoModule,
  ],
  providers: [UsersSocket, GamesSocket],
  bootstrap: [AppComponent],
})
export class AppModule {}
