import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { Tournament } from '../tournament';

@Component({
  selector: 'app-room-action',
  templateUrl: './room-action.component.html',
  styleUrls: ['./room-action.component.css']
})
export class RoomActionComponent implements OnInit {
  active: number = 1;
  tournaments: Tournament[] = [];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTournaments();
    this.selectAction();

    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
        this.selectAction();
      }
    })
  }

  async getTournaments() {
    this.tournaments = await this.dataService.getTournaments();
    const dropdown = <HTMLInputElement>document.getElementById("tournament")!;

    //Add tournaments to the dropdown menu
    for (const tournament of this.tournaments) {
      const option = document.createElement("option");
      option.text = tournament.name;
      dropdown.appendChild(option);
    }
  }

  selectAction() {
    var url = new URL(window.location.href);
    var action = url.searchParams.get("action");
    if (action === "new") { this.active = 1; }
    if (action === "join") { this.active = 2; }
  }
}
