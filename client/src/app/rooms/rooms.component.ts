import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
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
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    if (this.isLoggedIn) {
      this.onRoomRequest();
    };
  };

  async onRoomRequest() {
    let usr: string = this.authService.getUsername();
    let userRooms: Array<any> = await this.dataService.getUserRooms(usr);
    
    let roomIDs: Array<string> = [];
    for (let room of userRooms){
      roomIDs.push(room.room_id);
    };

    this.rooms = await this.dataService.getRooms(roomIDs);
    let allTourns: Array<Tournament> = await this.dataService.getTournaments(); 
    for (let i = 0; i < this.rooms.length; i++) {
      let room: Room = this.rooms[i];
      let tourns: Array<Tournament> = allTourns.filter(function(tourn):boolean{return tourn._id == room.tournament_id});

      this.extraData[i] = {
        "tournament": tourns[0].name,
        "start_date": this.formatDate(tourns[0].start_date),
        "end_date": this.formatDate(tourns[0].end_date),
        "status": "",
        "numUsers": 0,
        "leader": "",
        "userPos": 0
      };

      const now = new Date();
      let start_date = new Date(tourns[0].start_date);
      let end_date = new Date(tourns[0].end_date);
      if(now < start_date){
        this.extraData[i].status = "Waiting to start";
      }else{
        if(now < end_date){
          this.extraData[i].status = "Active";
        }else{
          this.extraData[i].status = "Ended";
        };
      };
    };
    let roomUsers: Array<User> = await this.dataService.getRoomUsers(roomIDs);
    for(let j=0;j<this.rooms.length;j++){
      console.log(roomUsers)
      let users: Array<User> = roomUsers.filter(function(user):boolean{return user.rooms.room_id == roomIDs[j]}); //see ei tööta - user.rooms on array ja seda tuleb filtreerida
      this.extraData[j].numUsers = users.length;
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