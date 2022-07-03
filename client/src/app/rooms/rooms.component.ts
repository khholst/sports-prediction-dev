import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { Room } from '../rooms';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  public rooms: Room[] = [];

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    if(this.authService.getIsLoggedIn()){
      this.onRoomRequest();
    };
  };

  async onRoomRequest() {
    let usr: string = await this.authService.getUsername();
    let userRooms: Array<any> = await this.dataService.getUserRooms(usr);
    let roomIDs: Array<string> = [];
    userRooms.forEach(function(room) {
      roomIDs.push(room.room_id);
    });
    this.rooms = await this.dataService.getRooms(roomIDs);
    console.log(this.rooms);
  };

}
