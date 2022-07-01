import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  roomForm = this.formBuilder.group({
    name: ["", [Validators.required]],
    tournament: ["", []]
  })

  ngOnInit(): void {
    this.getTournaments();    
    this.selectAction();

    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
        this.selectAction();
      }
    })
  }

  onNewSubmit() {
    if (this.roomForm.valid) {
      const tournament_id = this.getTournamentIdByName(this.roomForm.value.tournament);
      this.roomForm.patchValue({tournament: tournament_id});
      console.log(this.roomForm.value)
    }
  }

  private getTournamentIdByName(name: string) {
    console.log(name)
    const tournament = this.tournaments.find(tournament => tournament.name === name);
    return tournament!.tournament_id;
  }

  onJoinSubmit() {

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
    this.roomForm.patchValue({tournament: this.tournaments[0].name})
  }


  selectAction() {
    var url = new URL(window.location.href);
    var action = url.searchParams.get("action");
    if (action === "new") { this.active = 1; }
    if (action === "join") { this.active = 2; }
  }


  get name() {
    return this.roomForm.get("name")!;
  }

}
