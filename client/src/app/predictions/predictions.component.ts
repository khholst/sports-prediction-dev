import { Component, OnInit } from '@angular/core';
import { Prediction } from '../prediction';
import { PredictionService } from '../prediction.service';

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
  public badgeClasses = ["bg-danger", "bg-warning", "bg-primary", "bg-success"]

  constructor(
    private predictionService: PredictionService
  ) { }

  ngOnInit(): void {
    this.getPredictions();
  }


  private async getPredictions() {
    this.predictions = await this.predictionService.getPredictions();
    this.predictions = this.predictions.predictions;
    this.filteredPredictions = this.predictions.map((element: any) => {return {...element}});

    
    const now = new Date();
    for (let i = 0; i < this.predictions.length; i++) {
       this.predictions[i].predictions.sort(this.sortPredictions);
       this.filteredPredictions[i].predictions = this.predictions[i].predictions.filter((prediction: any) => 
       new Date(prediction.game_id.time).getTime() > now.getTime());
    }


    //this.pushFinishedGamesToEnd(this.predictions, now);




    for(let i = 0; i < this.predictions.length; i++) {
      this.numTournaments.push(i);
      this.predictions[i].predictions.forEach((element: any) => {
        element.game_id.hasStarted = now.getTime() > new Date(element.game_id.time).getTime();
        element.game_id.printTime = this.formatTime(new Date(element.game_id.time));
      })
    }
  }

  private sortPredictions(a: any, b: any): number {
    const aDate = new Date(a.game_id.time);
    const bDate = new Date(b.game_id.time);

    if (aDate.getTime() > bDate.getTime()) { return 1 } 
    else if (aDate.getTime() < bDate.getTime()) { return -1; }
    else { return 0; }
  }

  private pushFinishedGamesToEnd(predictions: any, now: Date) {
    for (let j = 0; j < predictions.length; j++) {
      let appended = [];
      let spliced = [];
      for (let i = 0; i < predictions[j].predictions.length; i++) {
        const game = predictions[j].predictions[i];
  
        if (new Date(game.game_id.time).getTime() < now.getTime()) {
          spliced.push(i)
          appended.push(game);
        }
      }

      for (let i = appended.length - 1; i >= 0; i--) {
        predictions[j].predictions.splice(spliced[i], 1);
        predictions[j].predictions.push(appended[i]);
      }
    }
  }



  tournamentChange(index: number) {
    const now = new Date().getTime();
    
    this.filteredPredictions[index].predictions = this.predictions[index].predictions.filter((prediction: any) => 
        new Date(prediction.game_id.time).getTime() > now);
  }






  onFilter(filter: string, index: number) {
    const now = new Date().getTime();

    if (filter === "FINISHED") {
      this.filteredPredictions[index].predictions = this.predictions[index].predictions.filter((prediction: any) => 
        new Date(prediction.game_id.time).getTime() < now);
    } else if (filter === "UPCOMING") {
      this.filteredPredictions[index].predictions = this.predictions[index].predictions.filter((prediction: any) => 
        new Date(prediction.game_id.time).getTime() > now);
    } else if (filter === "ALL") {
      this.filteredPredictions[index].predictions = this.predictions[index].predictions;
    }


    console.log(this.filteredPredictions)
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
    }
    return "";
  }




  async onPrediction(game_id: string) {
    const score1: any = document.getElementById(game_id + ":team1");
    const score2: any = document.getElementById(game_id + ":team2");

    if(score1.value === "" || isNaN(score1.value)) {
      score1.classList.add("invalid-input");
    }

    if (score2.value === "" || isNaN(score2.value)) {
      score2.classList.add("invalid-input");
      return;
    }

    score1.classList.remove("invalid-input");
    score2.classList.remove("invalid-input");
    score1.setAttribute("disabled", "true");
    score2.setAttribute("disabled", "true");


    const card: any = document.getElementById(game_id + ":card");
    card.classList.add("predicted-card");

    const button: any = document.getElementById(game_id + ":submit");
    button.classList.add("predicted-button");

    //SAVE TO DB

    const prediction: Prediction = {
      game_id: game_id,
      score1: parseInt(score1.value),
      score2: parseInt(score2.value)
    }
    const response = await this.predictionService.newPrediction(prediction);
    console.log(response);

  }

}
