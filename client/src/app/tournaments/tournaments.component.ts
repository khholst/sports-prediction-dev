import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';


@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router
  ) {  }

  ngOnInit(): void {
    this.onRequest();
  };

  async onRequest() {
    const response = await this.dataService.getTournaments();
    console.log(response);
  };

}
