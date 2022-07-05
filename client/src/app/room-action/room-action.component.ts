import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { RoomService } from '../room.service';

import { Tournament } from '../tournament';
import { faBasketball, faFutbol } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-room-action',
  templateUrl: './room-action.component.html',
  styleUrls: ['./room-action.component.css']
})



export class RoomActionComponent implements OnInit {

  @ViewChild('content') content: any;
  modalReference: any;
  alert = {
    isShown: false,
    style: "success",
    message: "Prediction room created!"
  }

  active: number = 1;
  tournaments: Tournament[] = [];
  tournamentName: string = "";
  room = {
    response: false,
    exists: false,
    info: { name: "", tournament: "", sport: "", creator: "", members: "", _id: " "}
  }
  closeResult = "";
  joinResult = { error: false, msg: "" };

  //Icons
  faBasketball = faBasketball;
  faFootball = faFutbol;


  constructor(
    private dataService: DataService,
    private router: Router,
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private modalService: NgbModal
  ) { }

  roomForm = this.formBuilder.group({
    name: ["", [Validators.required]],
    tournament: ["", []]
  });

  joinRoomForm = this.formBuilder.group({
    join_key: ["", [Validators.required]]
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

      this.alert.isShown = true;
      if (response.code === 401) {
        this.alert.message = "Something went wrong. Your session has probably timed out!";
        this.alert.style = "danger";
        setTimeout(() => this.router.navigate(["/login"]), 2500);
      } else {
        setTimeout(() => this.router.navigate(["/rooms"]), 2500);  
      }
    }
  }

  private getTournamentIdByName(name: string) {
    return this.tournaments.find(tournament => tournament.name === name)?._id;
  }

  async onJoinSubmit() {
    if (this.joinRoomForm.valid) {
      const response = await this.roomService.findRoomByKey(this.joinRoomForm.value.join_key);
      this.room.response = true;
      console.log(response);

      if (response.code === 200) {
        this.room.exists = true;
        this.room.info = response;
        this.joinResult.error = false;
        this.modalReference = this.modalService.open(this.content);
      } else {
        this.room.exists = false;
      }
    }
  }

  async joinRoom() {

    try {
      const response = await this.roomService.joinRoom(this.room.info._id);

    
      this.modalReference.close();
    } catch (error: any) {
      this.joinResult.error = true;
      this.joinResult.msg = error.error.message;
    }




    // if (response.code === 201) {
    //   this.router.navigate(["/rooms"]);
    // }

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


  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }


  get name() {
    return this.roomForm.get("name")!;
  }

  get join_key() {
    return this.joinRoomForm.get("join_key")!;
  }

}
