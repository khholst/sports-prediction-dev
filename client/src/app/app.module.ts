import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainPageComponent } from './main-page/main-page.component'
import { Interceptor } from './interceptor';
import { AuthService } from './auth.service';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomActionComponent } from './room-action/room-action.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RoomComponent } from './room/room.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    RegisterComponent,
    LoginComponent,
    MainPageComponent,
    TournamentsComponent,
    RoomsComponent,
    RoomActionComponent,
    RoomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
