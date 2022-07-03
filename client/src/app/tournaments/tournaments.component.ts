import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Tournament } from '../tournament';
import { Game } from '../games';
import { Country } from '../countries';


@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {
  public isCollapsed: boolean[] = [];
  public tournaments: Tournament[] = [];
  public games: {[key:number]:Game[]} = {};
  public cntGames: Game[] = [];
  public countries: Country[] = [];
  public flags: {[key:string]:string} = {};
  public indexes: number[] = []; //For keeping track of expanded tournaments

  constructor(
    private dataService: DataService,
    private router: Router
  ) {  }

  ngOnInit(): void {
    this.onTournamentsRequest();
  };

  async onTournamentsRequest() {
    this.tournaments = await this.dataService.getTournaments();
    this.countries = await this.dataService.getCountries();

    let index = 0; //For keeping track of expanded tournaments
    for (let i = 0; i < this.tournaments.length; i++) {
      this.indexes.push(index);
      this.isCollapsed.push(true);
      this.tournaments[i].start_date = this.formatDate(this.tournaments[i].start_date, false);
      this.tournaments[i].end_date = this.formatDate(this.tournaments[i].end_date, false);
      index++;
    };
  };

  async onGamesRequest(tournID:number, isCol:boolean, index:number, element:any) {
    if(!isCol){
      element.textContent = "Hide games ▲";
      if(!(index in this.games)){
        this.games[index] = await this.dataService.getGames(tournID);
        for (let i = 0; i < this.games[index].length; i++) {
          this.games[index][i].time = this.formatDate(this.games[index][i].time, true);
          let t1: string = this.games[index][i].team1;
          let t2: string = this.games[index][i].team2;
          let cnt1 = this.countries.filter(function(cnt):boolean{return cnt.country_id==t1})[0].name;
          let cnt2 = this.countries.filter(function(cnt):boolean{return cnt.country_id==t2})[0].name;
          if(!(cnt1 in this.flags)){this.flags[cnt1]=t1};
          if(!(cnt2 in this.flags)){this.flags[cnt2]=t2};        
          this.games[index][i].team1 = cnt1;
          this.games[index][i].team2 = cnt2;
        };
      };
    }else{
      element.textContent = "Show games ▼";
    };
  };

  private formatDate(dateString: string, time:boolean): string {
    const monthLookup: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                                  "October", "November", "December"];
    const date = new Date(dateString);
    if(!time){return `${date.getDate()}. ${monthLookup[date.getMonth()]}`}
    else{return`${date.getDate()}. ${monthLookup[date.getMonth()]} ${date.getHours().toString().replace(/^0$/,"00")}:${date.getMinutes().toString().replace(/^0$/,"00")}`};
  };

  popUpper(team:string, index:number){
    this.cntGames = this.games[index].filter(function(game):boolean{return game.team1==team || game.team2==team});
  };

}
