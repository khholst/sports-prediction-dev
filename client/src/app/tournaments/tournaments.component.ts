import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { ResultService } from '../services/result.service';
import { Tournament } from '../models/tournament';
import { Game } from '../models/games';
import { Country } from '../models/countries';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { faPlus, faAnglesUp, faAnglesDown, faLocationDot, faBasketball, faFutbol, faVolleyball, faStar } from '@fortawesome/free-solid-svg-icons';
import { TournamentService } from '../services/tournament.service';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';
import { GameService } from '../services/game.service';
import { Title } from '@angular/platform-browser';
import { NewPredictionFormComponent } from './new-prediction-form/new-prediction-form.component';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {
  public isAdmin: boolean = false;
  public isCollapsed: boolean[] = [];
  public tournaments: Tournament[] = [];
  public games: {[key:number]:Game[]} = {};
  public cntGames: Game[] = [];
  public countries: Country[] = [];
  public countryNames: string[] = [];
  public flags: {[key:string]:string} = {};
  public indexes: number[] = []; //For keeping track of expanded tournaments
  public isLoading: boolean = true;
  public alert: any = {
    isOpen: false,
    message: "",
    type: ""
  };

  public active = 1;

  //Icons
  public addIcon = faPlus;
  public downIcon = faAnglesDown;
  public upIcon = faAnglesUp;
  public faLocation = faLocationDot;
  public faStar = faStar;


  private sportIcons: any = {
    football: faFutbol,
    basketball: faBasketball,
    volleyball: faVolleyball,
  }


  public onNewGameTournament: any = {
    name: "",
    id: "",
    index: -1
  }

  public onNewResultHomeTeam: string = "";
  public onNewResultAwayTeam: string = "";

  public game: Game = {
    team1: '',
    team2: '',
    score1: 0,
    score2: 0,
    tournament_id: '',
    time: '',
    stage: '',
    _id: ''
  };


  //Search function for country name autocomplete
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.countryNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );


  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private resultService: ResultService,
    private modalService: NgbModal,
    private tournamentService: TournamentService,
    private gameService: GameService,
    private formBuilder: FormBuilder,
    private titleService: Title
  ) { 
    this.titleService.setTitle("Sports Prediction - Tournaments");
  }


  newTournamentForm = this.formBuilder.group({
    name: ["", [Validators.required]],
    start_date: ["", [Validators.required]],
    end_date: ["", [Validators.required]],
    img_url: ["", [Validators.required]],
    num_games: ["", [Validators.required]],
    host: ["", [Validators.required]],
    sport: ["football", [Validators.required]]
  })

  newGameForm = this.formBuilder.group({
    team1: ["", [Validators.required]],
    team2: ["", [Validators.required]],
    time: ["", [Validators.required]],
    stage: ["G", [Validators.required]]
  })

  newResultForm = this.formBuilder.group({
    score1: ["", [Validators.required]],
    score2: ["", [Validators.required]]
  })


  ngOnInit(): void {
    this.onTournamentsRequest();
    this.isAdmin = this.authService.getIsAdmin();
  };

  async onTournamentsRequest() {
    this.tournaments = await this.dataService.getTournaments();
    this.countries = await this.dataService.getCountries();


    let index = 0; //For keeping track of expanded tournaments
    for (let i = 0; i < this.tournaments.length; i++) {
      this.indexes.push(index);
      this.isCollapsed.push(true);
      this.tournaments[i].start_date_pretty = this.formatDate(this.tournaments[i].start_date, false);
      this.tournaments[i].end_date_pretty = this.formatDate(this.tournaments[i].end_date, false);
      index++;
    };
    this.isLoading = false;
  };

  async onGamesRequest(tournID:string, isCol:boolean, index:number) {
    const arrow:any = document.getElementsByClassName("arrow-icon" + index);
    const show:any = document.getElementById("show-hide-games" + index);

    if(!isCol){
      show.textContent = " Hide games ";
      arrow[0].classList.toggle("down");
      arrow[1].classList.toggle("down");

      if(!(index in this.games)){
        this.games[index] = await this.dataService.getGames(tournID);
        for (let i = 0; i < this.games[index].length; i++) {
          this.games[index][i].time = this.formatDate(this.games[index][i].time, true);
          let t1: string = this.games[index][i].team1;
          let t2: string = this.games[index][i].team2;
          let cnt1: string = this.countries.filter(function(cnt):boolean{return cnt.country_id==t1})[0].name;
          let cnt2: string = this.countries.filter(function(cnt):boolean{return cnt.country_id==t2})[0].name;
          if(!(cnt1 in this.flags)){this.flags[cnt1]=t1};
          if(!(cnt2 in this.flags)){this.flags[cnt2]=t2};        
          this.games[index][i].team1 = cnt1;
          this.games[index][i].team2 = cnt2;
        };
      };
    } else {
      arrow[0].classList.toggle("down");
      arrow[1].classList.toggle("down");
      show.textContent = " Show games ";
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


  onNewTournament(content: any) {
    this.modalService.open(content);
  }


  onNewGame(tournament: Tournament, index: number) {
    //Add auto completetion names to array
    if (this.countryNames.length === 0) {
      for (let i = 0; i < this.countries.length; i++) {
        this.countryNames.push(this.countries[i].name)
      }
    }
    const modal = this.modalService.open(NewPredictionFormComponent);
    modal.componentInstance.tournament = tournament;
    modal.componentInstance.countryNames = this.countryNames;
    modal.componentInstance.countries = this.countries;

    // Reflect new game in opened game list
    modal.componentInstance.newGame.subscribe((newGame: Game) => {
      if (Object.keys(this.games).length > 0) {
        this.games[index].push(newGame);
      }
    });
  }
  

  onGameResult(game: Game, content: any) {
    this.game = game;
    this.modalService.open(content);
  }


  async saveTournament() {
    if (this.newTournamentForm.valid) {
      try {
        this.newTournamentForm.value.end_date = new Date(this.newTournamentForm.value.end_date);
        this.newTournamentForm.value.host = this.newTournamentForm.value.host.split(",");
        const result = await this.tournamentService.newTournament(this.newTournamentForm.value);
        this.showAlert("Tournament saved successfully", "success");
      } catch (error: any) {
        console.log("error")
        if(error.status === 401) {
          this.authService.navigateToLogin();
        } else if (error.status === 403) {
          this.showAlert("You are not authorized to save a tournament", "danger");
        } else {
          this.showAlert("Tournament could not be saved, please try again", "danger");
        }
      } 
    }
  }

  async saveGame() {
    if (this.newGameForm.valid) {
      try {
        const formClone = JSON.parse(JSON.stringify(this.newGameForm.value));

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

        const result = await this.gameService.newGame(this.onNewGameTournament.id, this.newGameForm.value);
        this.showAlert(`${this.onNewGameTournament.name} game saved successfully!`, "success");

      } catch (error: any) {
        if(error.status === 401) {
          this.authService.navigateToLogin();
        } else if (error.status === 403) {
          this.showAlert(`You are not authorized to add a new game to ${this.onNewGameTournament.name}`, "danger");
        } else {
          this.showAlert(`${this.onNewGameTournament.name} game could not be saved, please try again!`, "danger");
        }
      }
    }
  }



  async saveResult(game: Game){
    if (this.newResultForm.valid) {
      try {
        game.score1 = this.newResultForm.value.score1;
        game.score2 = this.newResultForm.value.score2;
        const result = await this.resultService.newResult(game);
        this.showAlert("Result added successfully!", "success");
      } catch (error: any) {
        if(error.status === 401) {
          this.authService.navigateToLogin();
        } else if (error.status === 403) {
          this.showAlert("You are not authorized to add a result", "danger");
        } else {
          this.showAlert("Result could not be saved, please try again", "danger");
        }
      }
    }
  }


  private showAlert(message: string, type: string) {
    this.modalService.dismissAll();
        this.alert.isOpen = true;
        this.alert.message = message;
        this.alert.type = type;

        setTimeout(() => {
          this.alert.isOpen = false;
        }, 4000)
  }


  public getTournamentSportIcon(sport:string) {
    return this.sportIcons[sport];
  }






  //Tournament form getters
  get name() {
    return this.newTournamentForm.get("name")!;
  }

  get start_date() {
    return this.newTournamentForm.get("start_date")!;
  }

  get end_date() {
    return this.newTournamentForm.get("end_date")!;
  }

  get img_url() {
    return this.newTournamentForm.get("img_url")!;
  }

  get num_games() {
    return this.newTournamentForm.get("num_games")!;
  }

  get host() {
    return this.newTournamentForm.get("host")!;
  }

  get sport() {
    return this.newTournamentForm.get("sport")!;
  }


  //New game form getters
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

  //Game result form getters
  get score1(){
    return this.newResultForm.get("score1")!;
  }

  get score2(){
    return this.newResultForm.get("score2")!;
  }
}
