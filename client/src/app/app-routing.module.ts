import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './room/room.component';
import { RoomActionComponent } from './room-action/room-action.component';
import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { IsNotAuthenticatedGuard } from './is-not-authenticated.guard';


const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'register', component: RegisterComponent, canActivate: [IsNotAuthenticatedGuard] },
  { path: 'login', component: LoginComponent, canActivate: [IsNotAuthenticatedGuard] },
  { path: 'tournaments', component: TournamentsComponent},
  { path: 'rooms', component: RoomsComponent, canActivate: [IsAuthenticatedGuard] },
  { path: 'rooms/action', component: RoomActionComponent, canActivate: [IsAuthenticatedGuard] },
  { path: 'rooms/:id', component: RoomComponent, canActivate: [IsAuthenticatedGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
