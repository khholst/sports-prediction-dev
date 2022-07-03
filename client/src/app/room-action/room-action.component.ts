import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

import { DataService } from '../data.service';
import { RoomService } from '../room.service';

import { Tournament } from '../tournament';


@Component({
  selector: 'app-room-action',
  templateUrl: './room-action.component.html',
  styleUrls: ['./room-action.component.css']
})



export class RoomActionComponent implements OnInit {
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert | undefined;

  active: number = 1;
  tournaments: Tournament[] = [];
  tournamentName: string = "";
  alertIsShown: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private formBuilder: FormBuilder,
    private roomService: RoomService,
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

  async onNewSubmit() {
    if (this.roomForm.valid) {
      this.tournamentName = this.roomForm.value.tournament;
      const tournament_id = this.getTournamentIdByName(this.roomForm.value.tournament);
      this.roomForm.patchValue({tournament: tournament_id});
      const response = await this.roomService.createNewRoom(this.roomForm.value);
      this.alertIsShown = true;
      setTimeout(() => this.staticAlert!.close(), 3000);
    
    }
  }

  private getTournamentIdByName(name: string) {
    return this.tournaments.find(tournament => tournament.name === name)?._id;
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

  close() {
    this.router.navigate(["/rooms"]);

  }


  get name() {
    return this.roomForm.get("name")!;
  }

}
