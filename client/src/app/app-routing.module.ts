import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { GamesComponent } from './games/games.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomActionComponent } from './room-action/room-action.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tournaments', component: TournamentsComponent},
  { path: 'games', component: GamesComponent},
  { path: 'rooms', component: RoomsComponent },
  { path: 'rooms/action', component: RoomActionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
