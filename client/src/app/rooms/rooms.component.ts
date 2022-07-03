import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { Room } from '../room';

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
    if(this.isLoggedIn){
      this.onRoomRequest();
    };
  };

  async onRoomRequest() {
    let usr: string = await this.authService.getUsername();
    let userRooms: Array<any> = await this.dataService.getUserRooms(usr);
    
    let roomIDs: Array<string> = [];
    for (let room of userRooms){
      roomIDs.push(room.room_id);
    };
    this.rooms = await this.dataService.getRooms(roomIDs);
    for (let i=0;i<this.rooms.length;i++){
      let tourns = await this.dataService.getTournaments(this.rooms[i]._id);
      let roomUsers = await this.dataService.getRoomsUsers(this.rooms[i]._id);
      console.log(roomUsers);
      this.extraData[i] = {
        "tournament": tourns[0].name,
        "start_date": this.formatDate(tourns[0].start_date),
        "end_date": this.formatDate(tourns[0].end_date),
        "status": ""
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
    this.indexes = Array.from(Array(this.rooms.length).keys());
  };

  private formatDate(dateString: string): string {
    const monthLookup: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                                  "October", "November", "December"];
    const date = new Date(dateString);
    return `${date.getDate()}. ${monthLookup[date.getMonth()]}`
  };

}
