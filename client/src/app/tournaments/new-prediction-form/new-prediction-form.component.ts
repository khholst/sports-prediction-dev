import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';

import { GameService } from '../../services/game.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { Country } from 'src/app/models/countries';

@Component({
  selector: 'app-new-prediction-form',
  templateUrl: './new-prediction-form.component.html',
  styleUrls: ['./new-prediction-form.component.css']
})
export class NewPredictionFormComponent implements OnInit {
  @Input() tournament: any;
  @Input() countries: Country[] = [];
  @Input() countryNames: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public gameService: GameService,
    public authService: AuthService,
    public alertService: AlertService
  ) { }

  //Search function for country name autocomplete
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.countryNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  public active: number = 1;
  public modal: any;

  public alert: any = {
    isOpen: false,
    message: "",
    type: ""
  };

  newGameForm = this.formBuilder.group({
    team1:  ["", [Validators.required]],
    team2:  ["", [Validators.required]],
    time:   ["", [Validators.required]],
    stage:  ["G", [Validators.required]]
  })

  newSpecialForm = this.formBuilder.group({
    prediction:  ["", [Validators.required]],
    points:      ["", [Validators.required]],
    type:        ["country", [Validators.required]],
  })

  ngOnInit(): void {
  }

  async saveGame() {
    if (this.newGameForm.valid) {

      try {
        this.newGameForm.value.time = new Date(this.newGameForm.value.time).toISOString();
        this.newGameForm.value.score1 = -1;
        this.newGameForm.value.score2 = -1;

        for (let i = 0; i < this.countries.length; i++) {
          if (this.countries[i].name === this.newGameForm.value.team1) {
            this.newGameForm.value.team1 = this.countries[i].country_id;
          }
          if (this.countries[i].name === this.newGameForm.value.team2){
            this.newGameForm.value.team2 = this.countries[i].country_id;
          }
        }
        const result = await this.gameService.newGame(this.tournament.id, this.newGameForm.value);
        const timeResultShown = 3000;
        this.alertService.showAlert(this.alert, `${this.tournament.name} game saved successfully!`, "success", timeResultShown);

        setTimeout(() => {
          this.activeModal.dismiss();
        }, timeResultShown)

      } catch (error: any) {
        if(error.status === 401) {
          this.authService.navigateToLogin();
        } else if (error.status === 403) {
          this.alertService.showAlert(this.alert, `You are not authorized to add a new game to ${this.tournament.name}`, "danger", -1);
        } else {
          this.alertService.showAlert(this.alert, `${this.tournament.name} game could not be saved, please try again!`, "danger", -1);
        }
      }
    }
  }

  async saveSpecial() {
    if (!this.newSpecialForm.valid) {
      return;
    }

    try {
      this.newSpecialForm.value.userPrediction = "NULL"
      this.newSpecialForm.value.result         = "NULL"
      this.newSpecialForm.value.userPoints     = -1
      this.newSpecialForm.value.activeUntil    = "GET DATE FROM TOURNAMENT"


      console.log(this.newSpecialForm.value)
    } catch (error) {
      
    }


  }

   // New game form getters
   get team1() {
    return this.newGameForm.get("team1")!;
  }

  get team2() {
    return this.newGameForm.get("team2")!;
  }

  get time() {
    return this.newGameForm.get("time")!;
  }

  get stage() {
    return this.newGameForm.get("stage")!;
  }


  // New special prediction form getters
  get specialPrediction() {
    return this.newSpecialForm.get("prediction")!;
  }

  get specialType() {
    return this.newSpecialForm.get("type")!;
  }

  get specialPoints() {
    return this.newSpecialForm.get("points")!;
  }


}
