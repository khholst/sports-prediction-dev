import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router
  ) {  }

  ngOnInit(): void {
    
  };

  async onRequest(tourID:string) {
    const response = await this.dataService.getGames(tourID);
  };

}
