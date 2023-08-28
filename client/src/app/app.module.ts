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
import { AuthService } from './services/auth.service';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomActionComponent } from './room-action/room-action.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RoomComponent } from './room/room.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { PredictionsComponent } from './predictions/predictions.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NewPredictionFormComponent } from './tournaments/new-prediction-form/new-prediction-form.component';
import { NewSpecialResultComponent } from './tournaments/new-special-result/new-special-result.component';

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
    PredictionsComponent,
    NewPredictionFormComponent,
    NewSpecialResultComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    AngularMultiSelectModule,
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
