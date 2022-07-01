import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Tournament } from '../tournament';


@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {
  public isCollapsed: boolean[] = [];
  public tournaments: Tournament[] = [];
  public indexes: number[] = []; //For keeping track of expanded tournaments

  constructor(
    private dataService: DataService,
    private router: Router
  ) {  }

  ngOnInit(): void {
    this.onRequest();

  };

  async onRequest() {
    this.tournaments = await this.dataService.getTournaments();

    let index = 0; //For keeping track of expanded tournaments
    for (let i = 0; i < this.tournaments.length; i++) {
      this.indexes.push(index);
      this.isCollapsed.push(true);
      this.tournaments[i].start_date = this.formatDate(this.tournaments[i].start_date)
      this.tournaments[i].end_date = this.formatDate(this.tournaments[i].end_date)
      console.log(this.tournaments)
      index++;
    }
  };

  private formatDate(dateString: string): string {
    const monthLookup: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                                  "October", "November", "December"];
    const date = new Date(dateString); 

    return `${date.getDate()} ${monthLookup[date.getMonth()]}`;
  }

}
