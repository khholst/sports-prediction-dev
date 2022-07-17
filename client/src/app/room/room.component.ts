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
  public dropdownSettings:object = {};
  public dropdownList: Array<object> = [];
  public selectedItems: Array<any> = [];

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
    this.findStats();
    this.generateDropdownData();
    this.generateChartData(this.selectedItems);
  };

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
      this.statDict[usrs[i].username] = {
        "points": pnts,
        "totalPredsMade": totalPredsMade.length,
        "accPred": totalPredsMade.filter(function(pred:any):boolean{return pred.points==3}).length,
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
      "xAxisLabel": 'Games',
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
