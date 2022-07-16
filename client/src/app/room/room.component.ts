import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { Room } from '../room';
import { Tournament } from '../tournament';
import { RoomService } from '../room.service';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  public roomUsers: User[] = [];
  public roomName: string = "";
  public room = new Room();
  public faTrophy = faTrophy;
  public active: number = 1;
  public statDict: {[username:string]:any} = {};
  public activeUser: string = this.authService.getUsername();
  public chartData: {[prop:string]:any} = {};

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.onRoomRequest();
    this.generateChartProps();
  };

  async onRoomRequest(){
    const roomID: string = this.route.snapshot.paramMap.get("id")!;
    const rooms: Array<Room> = await this.roomService.getRoom(roomID);
    this.room = rooms[0];
    
    const tournaments: Array<Tournament> = await this.dataService.getTournaments(this.room.tournament_id);
    this.room.tournament = tournaments[0].name;
    this.room.start_date = tournaments[0].start_date;
    this.room.end_date = tournaments[0].end_date;
    this.room.tournament_id = tournaments[0]._id;

    const now = new Date();
    const start_date = new Date(this.room.start_date);
    const end_date = new Date(this.room.end_date);

    if (now < start_date) {
      this.room.status = "W";
      let diffInMs: number = Math.abs(start_date.valueOf() - now.valueOf());
      let diff: number =  diffInMs / (1000 * 60 * 60 * 24);
      this.room.timeUntil = Math.ceil(diff);
    } else if (now < end_date) {
        this.room.status = "A";
    } else {
        this.room.status = "E";
    };
    
    this.roomUsers = await this.roomService.getRoomUsers([roomID]);
    const isThereAnyScore: Array<number> = this.roomUsers[0].tournaments.filter(function(trn):boolean{return trn.tournament_id === tournaments[0]._id})[0].scores;
    if(isThereAnyScore.length>0){
      const lastIndex: number = isThereAnyScore.length - 1;
      this.roomUsers.sort(
        (firsUser: User, secondUser: User) =>
          (firsUser.tournaments.filter(function(trn):boolean{return trn.tournament_id === tournaments[0]._id})[0].scores[lastIndex] > secondUser.tournaments.filter(function(trn):boolean{return trn.tournament_id === tournaments[0]._id})[0].scores[lastIndex]) ? -1 : 1);
    };
    this.generateChartData();
  };

  formatDate(dateString: string): string {
    const monthLookup: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                                  "October", "November", "December"];
    const date = new Date(dateString);
    return `${date.getDate()}. ${monthLookup[date.getMonth()]}`
  };

  findStats(username: string): number {
    const trn_id: string = this.room.tournament_id;
    const usr: User = this.roomUsers.filter(function(user):boolean{return user.username == username})[0];
    const trns: Array<any> = usr.tournaments.filter(function(trn):boolean{return trn.tournament_id == trn_id});
    const pnts: number = trns[0].scores[trns[0].scores.length-1];
    const totalPredsMade: Array<any> = trns[0].predictions.filter(function(pred:any):boolean{return pred.points > -999});
    this.statDict[username] = {
      "totalPredsMade": totalPredsMade.length,
      "accPred": totalPredsMade.filter(function(pred:any):boolean{return pred.points==3}).length,
      "averPnts": (pnts/totalPredsMade.filter(function(pred:any):boolean{return pred.points>=0}).length).toFixed(2)
    };
    return pnts
  };

  generateChartProps() {
    this.chartData = {
      "view": [700, 300],
      "legend": true,
      "showLabels": true,
      "animations": true,
      "xAxis": true,
      "yAxis": true,
      "showYAxisLabel": true,
      "showXAxisLabel": true,
      "xAxisLabel": 'Games',
      "yAxisLabel": 'Score',
      "timeline": false,
      "colorScheme": {
        "domain": ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
      },
    };
  };

  generateChartData() {
    console.log(this.roomUsers);
    let usersData: Array<object> = [];
    const tournament_id: string = this.room.tournament_id;
    this.roomUsers.forEach(function (user) {
      const scores: Array<number> = user.tournaments.filter(function(trn):boolean{return trn.tournament_id == tournament_id})[0].scores;
      let series: Array<any> = [];
      for(let i=0;i<scores.length;i++){
        const serr: object = {
          "name": i,
          "value": scores[i]
        };
        series.push(serr);
      };
      const userObj: object = {
        "name": user.username,
        "series": series
      };
      usersData.push(userObj);
    }); 
    this.chartData["users"] = usersData;
  };

}
