import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { Room } from '../models/room';
import { Tournament } from '../models/tournament';
import { RoomService } from '../services/room.service';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { faTrophy, faCopy, faMedal } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})


export class RoomComponent implements OnInit {
  public roomUsers: User[] = [];
  public roomName: string = "";
  public room = new Room();
  public active: number = 1;
  public statDict: {[username:string]:any} = {};
  public activeUser: string = this.authService.getUsername();
  public chartData: {[prop:string]:any} = {};
  public dropdownSettings:object = {};
  public dropdownList: Array<object> = [];
  public selectedItems: Array<any> = [];
  public gamesPlayed: number = 0;
  public pieChartData: any[] = [];
  public loading = true;

  //Icons
  public faTrophy = faTrophy;
  public faCopy = faCopy;
  public faMedal = faMedal;


  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.onRoomRequest();
    this.generateChartProps();
    this.generateDropdown();
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
    this.room.num_games = tournaments[0].num_games;


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
    
    this.getScores();





    const isThereAnyScore: Array<number> = this.roomUsers[0].tournaments.filter(function(trn):boolean{return trn.tournament_id === tournaments[0]._id})[0].scores;
    if(isThereAnyScore.length>0){
      const lastIndex: number = isThereAnyScore.length - 1;
      this.roomUsers.sort(
        (firstUser: User, secondUser: User) =>
          (firstUser.tournaments.filter(function(trn):boolean{return trn.tournament_id === tournaments[0]._id})[0].scores[lastIndex] > secondUser.tournaments.filter(function(trn):boolean{return trn.tournament_id === tournaments[0]._id})[0].scores[lastIndex]) ? -1 : 1);
    };

    this.findStats();
    this.generateDropdownData();
    this.generateChartData(this.selectedItems);
    this.generatePieChartData();
    this.loading = false;
  };


  private generatePieChartData() {
    const username = this.authService.getUsername();
    const userData = this.statDict[username];

    this.pieChartData = [
      { "name": "Accurate",
        "value": userData.point3
      },
      { "name": "2 points",
        "value": userData.point2
      },
      { "name": "1 point",
        "value": userData.point1
      },
      { "name": "Incorrect",
        "value": userData.missPred
      }
    ]
  }


  //Calculate score array
  private getScores() {
        for (let i = 0; i < this.roomUsers.length; i++) {
          for (let j = 0; j < this.roomUsers[i].tournaments.length; j++) {
            
            if (this.room.tournament_id === this.roomUsers[i].tournaments[j].tournament_id) {
              let index = 1;
              let predictions = this.roomUsers[i].tournaments[j].predictions;
              const scores = [predictions[0].points];
              while (predictions[index].points != -999) {
                scores.push(scores[scores.length - 1] + predictions[index].points);
                index++;
              }
              this.roomUsers[i].tournaments[j].scores = scores;
            }
          }
        }
  }

  formatDate(dateString: string): string {
    const monthLookup: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                                  "October", "November", "December"];
    const date = new Date(dateString);
    return `${date.getDate()}. ${monthLookup[date.getMonth()]}`
  };

  findStats() {
    const trn_id: string = this.room.tournament_id;
    const usrs: Array<User> = this.roomUsers;
    for(let i=0;i<usrs.length;i++){
      const trns: Array<any> = usrs[i].tournaments.filter(function(trn):boolean{return trn.tournament_id == trn_id});
      const pnts: number = trns[0].scores[trns[0].scores.length-1];
      const totalPredsMade: Array<any> = trns[0].predictions.filter(function(pred:any):boolean{return pred.points > -999});
      this.gamesPlayed = totalPredsMade.length;
      this.statDict[usrs[i].username] = {
        "points": pnts,
        "totalPredsMade": totalPredsMade.length,
        "point3": totalPredsMade.filter(function(pred:any):boolean{return pred.points==3}).length,
        "point2": totalPredsMade.filter(function(pred:any):boolean{return pred.points==2}).length,
        "point1": totalPredsMade.filter(function(pred:any):boolean{return pred.points==1}).length,
        "missPred": totalPredsMade.filter(function(pred:any):boolean{return pred.points==0}).length,
        "averPnts": (pnts/totalPredsMade.filter(function(pred:any):boolean{return pred.points>=0}).length).toFixed(2)
      };
    };
  };

  generateChartProps() {
    this.chartData = {
      "legend": true,
      "showLabels": true,
      "animations": true,
      "xAxis": true,
      "yAxis": true,
      "showYAxisLabel": true,
      "showXAxisLabel": true,
      "xAxisLabel": 'Games played',
      "yAxisLabel": 'Score',
      "timeline": false,
      "colorScheme": {
        "domain": ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
      },
    };
  };

  generateChartData(selectedUsers: Array<object>) {
    let usersData: Array<object> = [];
    const tournament_id: string = this.room.tournament_id;;
    let rUsers: Array<any> = [];

    if(selectedUsers.length>0){
      rUsers = this.roomUsers.filter((usr:any)=> {
        return selectedUsers.some((f:any)=> {
          return f.itemName == usr.username;
        });
      });

      rUsers.forEach(function (user) {
        const scores: Array<number> = user.tournaments.filter(function(trn:any):boolean{return trn.tournament_id == tournament_id})[0].scores;
        let series: Array<any> = [];
        series.push({"name":"0","value":0});
        for(let i=0;i<scores.length;i++){
          const serr: object = {
            "name": (i+1).toString(),
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
      this.chartData["legend"] = true;
    }else{
      this.chartData["legend"] = false;
      usersData.push({"name":"","series":[{"name":"","value":0}]});
    }
    this.chartData["users"] = usersData;
  };

  generateDropdownData() {
    let dropdownData: Array<object> = [];
    let ind: number = 1;
    this.roomUsers.forEach(function (user) {
      dropdownData.push({"id": ind, "itemName": user.username});
      ind++;
    });
    this.dropdownList = dropdownData;  
    this.selectedItems = dropdownData; 
  };

  generateDropdown() {
    this.dropdownSettings = {
      singleSelection: false, 
      text:"Select Users",
      selectAllText:'Select All',
      unSelectAllText:'Deselect All',
      enableSearchFilter: true,
      classes:"myclass custom-class",
      autoPosition: false
    };
  };

  copyJoinKey() {
    navigator.clipboard.writeText(this.room.join_key);
  }

  onItemSelect(item:any){
    this.generateChartData(this.selectedItems);
  };

  onItemDeSelect(item:any){
      this.generateChartData(this.selectedItems);
  };

  onSelectAll(items: any){
    this.generateChartData(this.selectedItems);
  };

  onDeSelectAll(items: any){
    this.generateChartData(this.selectedItems);
  };

  onFilterSelectAll(items: any){
    this.generateChartData(this.selectedItems);
  };

  onFilterDeSelectAll(items: any){
    this.generateChartData(this.selectedItems);
  };
}
