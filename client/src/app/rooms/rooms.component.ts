import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { RoomService } from '../room.service';
import { Room } from '../room';
import { Tournament } from '../tournament';
import { User } from '../user';


@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  public rooms: Room[]= [];
  public isLoggedIn: boolean = false;
  public indexes: number[] = [];
  public extraData: {[key:number]:any} = {};

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    if (this.isLoggedIn) {
      this.onRoomRequest();
    };
  };

  async onRoomRequest() {
    const usr: string = this.authService.getUsername();
    this.rooms = await this.roomService.getRooms(usr);

    const allTourns: Array<Tournament> = await this.dataService.getTournaments(); 
    for (let i = 0; i < this.rooms.length; i++) {
      let room: Room = this.rooms[i];
      let tournament: Tournament = allTourns.find(function(tourn) {return tourn._id === room.tournament_id})!;

      this.extraData[i] = {
        "tournament": tournament.name,
        "start_date": this.formatDate(tournament.start_date),
        "end_date": this.formatDate(tournament.end_date),
        "status": "",
        "numUsers": 0,
        "leader": "",
        "userPos": 0,
        "timeUntil": 0
      };

      const now = new Date();
      const start_date = new Date(tournament.start_date);
      const end_date = new Date(tournament.end_date);


      if (now < start_date) {
        this.extraData[i].status = "W";
        let diffInMs: number = Math.abs(start_date.valueOf() - now.valueOf());
        let diff: number =  diffInMs / (1000 * 60 * 60 * 24);
        this.extraData[i].timeUntil = Math.ceil(diff);
      } else if (now < end_date) {
          this.extraData[i].status = "A";
      } else {
          this.extraData[i].status = "E";
      };
    };

    let roomIDs: string[] = [];
    for (const room of this.rooms) {
      roomIDs.push(room._id);
    }

    let roomUsers: Array<User> = await this.roomService.getRoomUsers(roomIDs);
    for (let j=0;j<this.rooms.length;j++) {
      let users: Array<User> = roomUsers.filter(
        function(user):boolean{
          return user.rooms.filter(function(room):boolean{return room.room_id === roomIDs[j]}).length>0;
      });
      this.extraData[j].numUsers = users.length;

      users.sort(
        (firsUser: User, secondUser: User) =>
          (firsUser.rooms.filter(function(room):boolean{return room.room_id === roomIDs[j]})[0].score > secondUser.rooms.filter(function(room):boolean{return room.room_id == roomIDs[j]})[0].score) ? -1 : 1
      );

      this.extraData[j].leader = users[0].username;
      this.extraData[j].userPos = users.findIndex(object => {
        return object.username === usr;
      }) + 1;
      
    };
    this.indexes = Array.from(Array(this.rooms.length).keys());
  };

  private formatDate(dateString: string): string {
    const monthLookup: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                                  "October", "November", "December"];
    const date = new Date(dateString);
    return `${date.getDate()}. ${monthLookup[date.getMonth()]}`
  };
}