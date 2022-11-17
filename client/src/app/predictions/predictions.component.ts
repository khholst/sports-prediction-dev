import { Component, OnInit } from '@angular/core';
import { Prediction } from '../models/prediction';
import { PredictionService } from '../services/prediction.service';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { faArrowUpWideShort, faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';


@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.css']
})
export class PredictionsComponent implements OnInit {

  public active: number = 0;
  public predictions: any = {};
  public filteredPredictions: any = {};
  public numTournaments: number[] = [];
  public countryNames: string[] = ["Qatar", "Ecuador", "Senegal", "Netherlands", "England", "Iran", "United States of America", "Wales",
  "Argentina", "Saudi Arabia", "Mexico", "Poland", "France", "Australia", "Denmark", "Tunisia", "Spain", "Costa Rica", "Germany",
  "Japan", "Belgium", "Canada", "Morocco", "Croatia", "Brazil", "Serbia", "Switzerland", "Cameroon", "Portugal", "Ghana", "Uruguay", "Korea Republic"];
  
  public players: string[] = ["Djorkaeff Reasco", "Kevin Rodriguez", "Michael Estrada", "Enner Valencia", "Memphis Depay", "Steven Bergwijn", "Vincent Janssen", "Luuk de Jong", "Noa Lang", "Wout Weghors",
  "Sadio Mane", "Ismaila Sarr", "Boulaye Dia", "Bamba Dieng", "Famara Diedhiou", "Nicolas Jackson", "Iliman Ndiaye", "Harry Kane", "Callum Wilson", "Marcus Rashford", "Raheem Sterling", "Bukayo Saka", "Phil Foden", "Jack Grealish", "James Maddison",
  "Gareth Bale", "Kieffer Moore", "Mark Harris", "Brennan Johnson", "Daniel James", "Lionel Messi", "Angel Di Maria", "Lautaro Martinez", "Julian Alvarez", "Paulo Dybala", "Nicolas Gonzalez", "Joaquin Correa", "Rogelio Funes Mori", "Raul Jimenez", "Hirving Lozano", "Henry Martin", "Alexis Vega",
  "Robert Lewandowski", "Arkadiusz Milik", "Krzysztof Piatek", "Karol Swiderski", "Karim Benzema", "Kingsley Coman", "Ousmane Dembele", "Olivier Giroud", "Antoine Griezmann", "Kylian Mbappe", "Christopher Nkunku", "Marcus Thuram",
  "Andreas Cornelius", "Martin Braithwaite", "Kasper Dolberg", "Mikkel Damsgaard", "Jesper Lindstrom", "Yussuf Poulsen", "Andreas Skov Olsen", "Jonas Wind", "Kai Havertz", "Youssoufa Moukoko", "Niclas Fullkrug", "Karim Adeyemi", "Ferran Torres", "Nico Williams", "Yeremi Pino", "Alvaro Morata", "Marco Asensio", "Pablo Sarabia", "Dani Olmo", "Ansu Fati",
  "Romelu Lukaku", "Michy Batshuayi", "Lois Openda", "Charles De Ketelaere", "Eden Hazard", "Jeremy Doku", "Dries Mertens", "Leandro Trossard", "Ivan Perisic", "Andrej Kramaric", "Bruno Petkovic", "Mislav Orsic", "Ante Budimir", "Marko Livaja", "Antony", "Gabriel Jesus", "Gabriel Martinelli", "Neymar", "Pedro", "Raphinha", "Richarlison", "Rodrygo", "Vinicius Junior",
  "Dusan Tadic", "Aleksandar Mitrovic", "Dusan Vlahovic", "Filip Djuricic", "Luka Jovic", "Nemanja Radonjic", "Breel Embolo", "Ruben Vargas", "Djibril Sow", "Haris Seferovic", "Christian Fassnacht", "Cristiano Ronaldo", "Joao Felix", "Rafael Leao", "Ricardo Horta", "Goncalo Ramos", "Andre Silva",
  "Luis Suarez", "Darwin Nunez", "Maximiliano Gomez", "Edinson Cavani"," Frenkie de Jong", "Steven Berghuis", "Davy Klaassen", "Teun Koopmeiners", "Marten de Roon", "Cody Gakpo", "Kenneth Taylor", "Xavi Simons", "Declan Rice", "Jude Bellingham", "Kalvin Phillips", "Jordan Henderson", "Conor Gallagher", "Mason Mount",
  "Joe Allen", "Aaron Ramsey", "Rodrigo De Paul", "Leandro Paredes", "Alexis Mac Allister", "Guido Rodriguez", "Papu Gomez", "Enzo Fernandez", "Exequiel Palacios", "Luis Chavez", "Hector Herrera", "Grzegorz Krychowiak", "Eduardo Camavinga", "Youssouf Fofana", "Matteo Guendouzi", "Adrien Rabiot", "Aurelien Tchouameni", "Jordan Veretout",
  "Christian Eriksen", "Ilkay Gundogan", "Jonas Hofmann", "Leon Goretzka", "Serge Gnabry", "Leroy Sane", "Jamal Musiala", "Joshua Kimmich", "Thomas Muller", "Julian Brandt", "Mario Gotze", "Sergio Busquets", "Rodri", "Gavi", "Carlos Soler", "Marcos Llorente", "Pedri", "Koke", "Axel Witsel", "Youri Tielemans", "Amadou Onana", "Kevin De Bruyne", "Yannick Carrasco", "Thorgan Hazard", "Timothy Castagne", "Thomas Meunier",
  "Luka Modric", "Mateo Kovacic", "Bruno Guimaraes", "Casemiro", "Everton Ribeiro", "Fabinho", "Fred", "Lucas Paqueta", "Xherdan Shaqiri", "Granit Xhaka",
  "Joao Palhinha", "Ruben Neves", "Bernardo Silva", "Bruno Fernandes", "Joao Mario", "Matheus Nunes", "Vitinha", "William Carvalho", "Otavio"];

  public badgeClasses = ["bg-danger", "bg-warning", "bg-primary", "bg-success"];
  public isLoading = true;

  public sortAscending: boolean = true;
  public selectedSortField: string = "Date";
  public selectedFilter: string = "UPCOMING";

  //ICONS
  public sortDescIcon =  faArrowUpWideShort;
  public sortAscIcon = faArrowDownShortWide;

    //Search function for country name autocomplete
    searchCountries: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.countryNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

    //Search function for country name autocomplete
    searchPlayers: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.players.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );


  constructor(
    private predictionService: PredictionService,
    private authService: AuthService,
    private titleService: Title,
    private dataService: DataService
  ) { 
    this.titleService.setTitle("Sports Prediction - My Predictions");
  }

  ngOnInit(): void {
    this.getPredictions();
  }


  private async getPredictions() {
    try {
      this.predictions = await this.predictionService.getPredictions();
    } catch (error: any) {
      if (error.status === 401) {
        this.authService.navigateToLogin();
      }
    }

    this.predictions = this.predictions.predictions;

    this.filteredPredictions = this.predictions.map((element: any) => {return {...element}});

    
    const now = new Date();
    for (let i = 0; i < this.predictions.length; i++) {
       this.predictions[i].predictions.sort(this.sortPredictions);
       this.filteredPredictions[i].predictions = this.predictions[i].predictions.filter((prediction: any) => 
       new Date(prediction.game_id.time).getTime() > now.getTime());
    }


    for(let i = 0; i < this.predictions.length; i++) {
      this.numTournaments.push(i);
      this.predictions[i].predictions.forEach((element: any) => {
        element.game_id.hasStarted = now.getTime() > new Date(element.game_id.time).getTime();
        element.game_id.printTime = this.formatTime(new Date(element.game_id.time));
      })
    }
    this.isLoading = false;
  }


  private sortPredictions(a: any, b: any): number {
    const aDate = new Date(a.game_id.time);
    const bDate = new Date(b.game_id.time);

    if (aDate.getTime() > bDate.getTime()) { return 1 } 
    else if (aDate.getTime() < bDate.getTime()) { return -1; }
    return 0;
  }





  tournamentChange(index: number) {
    const now = new Date().getTime();
    
    this.filteredPredictions[index].predictions = this.predictions[index].predictions.filter((prediction: any) => 
        new Date(prediction.game_id.time).getTime() > now);

      this.sortAscending = true;
  }






  onFilter(filter: string, index: number) {
    const now = new Date().getTime();

    this.selectedFilter = filter;
    if (filter === "FINISHED") {
      this.filteredPredictions[index].predictions = this.predictions[index].predictions.filter((prediction: any) => 
        new Date(prediction.game_id.time).getTime() < now);
    } else if (filter === "UPCOMING") {
      this.filteredPredictions[index].predictions = this.predictions[index].predictions.filter((prediction: any) => 
        new Date(prediction.game_id.time).getTime() > now);
    } else if (filter === "ALL") {
      this.filteredPredictions[index].predictions = this.predictions[index].predictions;
    }
  }

  changeSortField(tournamentIndex: number, sortField: string) {
    this.selectedSortField = sortField;

    this.sortAndFilter(this.selectedSortField, tournamentIndex);
  }


  changeSortOrder(tournamentIndex: number) {
    this.sortAscending = !this.sortAscending;

    this.sortAndFilter(this.selectedSortField, tournamentIndex);
  }


  private sortAndFilter(sortField: string, tournamentIndex: number) {
    this.predictions[tournamentIndex].predictions = this.predictions[tournamentIndex].predictions.sort((a: any, b: any) => {
      if (sortField === "Date") {
        const aDate = new Date(a.game_id.time);
        const bDate = new Date(b.game_id.time);

        if (this.sortAscending) {                
          if (aDate.getTime() > bDate.getTime()) { return 1 }
          if (aDate.getTime() < bDate.getTime()) { return -1 }
          return 0
        } else {
          if (aDate.getTime() > bDate.getTime()) { return -1 }
          if (aDate.getTime() < bDate.getTime()) { return 1 }
          return 0
        }
      } else { //sort field is points
        if (this.sortAscending) {
          if (a.points > b.points) { return 1 }
          if (a.points < b.points) { return -1 }
          return 0
        } else {            
          if (a.points > b.points) { return -1 }
          if (a.points < b.points) { return 1 }
          return 0
        }
      }
    })
    this.onFilter(this.selectedFilter, tournamentIndex);
  }



  formatTime(time: Date): string {
    const minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    const month = time.getMonth() + 1;
    return `${time.getDate() < 10 ? "0" + time.getDate(): time.getDate()}/${month < 10 ? "0" + 
              month: month}/${time.getFullYear()} ${time.getHours()}:${minutes}` ;
  }


  getStageName(key: string): string {
    switch (key) {
      case "G":
        return "GROUP"
      case "1/32":
        return "ROUND OF 64"
      case "1/16":
        return "ROUND OF 32"
      case "1/8":
        return "ROUND OF 16"
      case "QF":
        return "QUARTER-FINAL"
      case "SF":
        return "SEMI-FINAL"
      case "F":
        return "FINAL"
      case "3rd":
        return "3rd PLACE"
    }
    return "";
  }


  async saveSpecial(type: string, index: number) {
    const input:any = document.getElementById(`${index}:${type}`)

    let prediction;
    if (type === "winner") { prediction = this.predictions[index].special_predictions[0] }
    else if (type === "scorer") { prediction = this.predictions[index].special_predictions[1] }
    prediction.user_prediction = input.value

    try {
      const result = await this.predictionService.newSpecialPrediction(prediction);
    } catch (error: any) {
      if (error.code === 401) {
        this.authService.navigateToLogin();
      } else {
        window.location.reload();
      }
    }
  }


  async onPrediction(game_id: string) {
    const score1: any = document.getElementById(game_id + ":team1");
    const score2: any = document.getElementById(game_id + ":team2");

    if(score1.value === "" || isNaN(score1.value) || score1.value < 0) {
      score1.classList.add("invalid-input");
      return;
    }

    if (score2.value === "" || isNaN(score2.value) || score1.value < 0) {
      score2.classList.add("invalid-input");
      return;
    }



    //SAVE TO DB
    const prediction: Prediction = {
      game_id: game_id,
      score1: parseInt(score1.value),
      score2: parseInt(score2.value)
    }

    try {
      const response = await this.predictionService.newPrediction(prediction);
      score1.classList.remove("invalid-input");
      score2.classList.remove("invalid-input");
      score1.setAttribute("disabled", "true");
      score2.setAttribute("disabled", "true");

      const card: any = document.getElementById(game_id + ":card");
      card.classList.add("predicted-card");

      const button: any = document.getElementById(game_id + ":submit");
      button.classList.add("predicted-button");

    } catch (error: any) {
      if (error.code === 401) {
        this.authService.navigateToLogin();
      }
    }
  }

}
