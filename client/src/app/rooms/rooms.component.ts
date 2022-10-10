import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { Tournament } from '../models/tournament';
import { User } from '../models/user';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  public rooms: Room[]= [];
  public filteredRooms: Room[] = [];
  public extraData: {[key:number]:any} = {};
  public faTrophy = faTrophy;
  public selectedFilter = "ALL";
  public isLoading = true;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private roomService: RoomService,
    private titleService: Title
  ) { 
    this.titleService.setTitle("Sports Prediction - My Rooms");
  }

  filter = new FormControl();

  ngOnInit(): void {
    this.onRoomRequest();
  };


  onFilter(filter: string) {
    const now = new Date().getTime();

    if (filter === "ALL") {
      this.filteredRooms = this.rooms;
    } else if (filter === "FINISHED"){
      this.filteredRooms = this.rooms.filter(room => new Date(room.end_date).getTime() < now);
      this.filteredRooms.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
    } else if (filter === "UPCOMING") {
      this.filteredRooms = this.rooms.filter(room => new Date(room.start_date).getTime() > now);
      this.filteredRooms.sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
    } else {
      this.filteredRooms = this.rooms.filter(room =>  new Date(room.end_date).getTime() > now &&
                                                      new Date(room.start_date).getTime() < now);
    }
  }


  async onRoomRequest() {
    const usr: string = this.authService.getUsername();
    this.rooms = await this.roomService.getRooms(usr);

    const allTourns: Array<Tournament> = await this.dataService.getTournaments();
    for (let i = 0; i < this.rooms.length; i++) {
      let room: Room = this.rooms[i];
      let tournament: Tournament = allTourns.find(function(tourn) {return tourn._id === room.tournament_id})!;
      this.extraData[i] = {
        "tournament": tournament.name,
        "start_date": tournament.start_date,
        "end_date": tournament.end_date,
        "status": "",
        "numUsers": 0,
        "timeUntil": 0,
        "tournament_id": tournament._id
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
    };

    if (roomIDs.length > 0) {
      let roomUsers: Array<User> = await this.roomService.getRoomUsers(roomIDs);
      
      for (let j=0; j<this.rooms.length; j++) {
        let users: Array<User> = roomUsers.filter(
          function(user):boolean{
            return user.rooms.filter(function(room):boolean{return room === roomIDs[j]}).length>0;
        });
        this.extraData[j].numUsers = users.length;

        this.rooms[j] = Object.assign(this.rooms[j], this.extraData[j])      
      };
    }

    this.filteredRooms = this.rooms;
    this.isLoading = false;
  };

  formatDate(dateString: string): string {
    const monthLookup: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                                  "October", "November", "December"];
    const date = new Date(dateString);
    return `${date.getDate()}. ${monthLookup[date.getMonth()]}`
  };
}