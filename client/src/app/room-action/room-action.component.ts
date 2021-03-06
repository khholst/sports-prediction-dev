import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

//SERVICES
import { DataService } from '../data.service';
import { RoomService } from '../room.service';

//DATA MODELS
import { Tournament } from '../tournament';

//ICONS
import { faBasketball, faFutbol } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-room-action',
  templateUrl: './room-action.component.html',
  styleUrls: ['./room-action.component.css']
})



export class RoomActionComponent implements OnInit {

  @ViewChild('content') content: any;
  modalReference: any;
  newAlert = {
    isShown: false,
    style: "success",
    message: "Prediction room created!"
  }

  findAlert = {
    isShown: false,
    message: ""
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
  joinAlert = { isShown: false, style: "", message: "" };

  //Icons
  faBasketball = faBasketball;
  faFootball = faFutbol;


  constructor(
    private dataService: DataService,
    private router: Router,
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private modalService: NgbModal,
    private location: Location
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

      try {
        const response = await this.roomService.createNewRoom(this.roomForm.value);
        setTimeout(() => this.router.navigate([`/rooms/${response.room_id}`]), 2500); 
      } catch (error: any) {
        this.newAlert.style = "danger";
        this.newAlert.message = error.error.errors[0].msg;
        setTimeout(() => this.router.navigate(["/login"]), 2500); 
      } finally {
        this.newAlert.isShown = true;
      }
    }
  }


  private getTournamentIdByName(name: string) {
    return this.tournaments.find(tournament => tournament.name === name)?._id;
  }


  async findRoom() {
    if (this.joinRoomForm.valid) {

      try {
        const response = await this.roomService.findRoomByKey(this.joinRoomForm.value.join_key);
        this.room.exists = true;
        this.room.info = response;
        this.joinAlert.isShown = false;
        this.modalReference = this.modalService.open(this.content);

      } catch (error: any) {
        this.room.exists = false;
        this.findAlert.isShown = true;
        this.findAlert.message = error.error.errors[0].msg;

        if (this.findAlert.message === "Your session has expired") {
          setTimeout(() => this.router.navigate(["/login"]), 2500);
        }
        
      } finally {
        this.room.response = true;
      }
    }
  }





  async joinRoom() {

    try {
      const response = await this.roomService.joinRoom(this.room.info._id);
      console.log(response);
      this.joinAlert.style = "success";
      this.joinAlert.message = `You have joined room ${this.room.info.name}!`;

      setTimeout(() => {
        this.router.navigate([`/rooms/${response.room_id}`]);
        this.modalReference.close();
      }, 2500)

    } catch (error: any) {
      this.joinAlert.style = "danger"
      this.joinAlert.message = error.error.errors[0].msg;

      if (this.joinAlert.message === "Your session has expired") {
        setTimeout(() => {
          this.router.navigate(["/login"]); 
          this.modalReference.close();
        }, 2500);
      }

    } finally {
      this.joinAlert.isShown = true;
    }
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
    if (action === "new")   { this.active = 1; }
    if (action === "join")  { this.active = 2; }
  }


  joinTabActivated() {
    this.location.go("/rooms/action?action=join"); 
  }

  
  newTabActivated() {
    this.location.go("/rooms/action?action=new"); 
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
