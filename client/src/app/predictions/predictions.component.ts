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
  public predictions: any = {}
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
    this.predictions.predictions[0].predictions.sort(this.sortPredictions);
    const now = new Date();

    console.log(this.predictions.predictions[0].predictions)

    let appended = [];
    let spliced = [];
    for (let i = 0; i < this.predictions.predictions[0].predictions.length; i++) {
      const game = this.predictions.predictions[0].predictions[i];

      if (new Date(game.game_id.time).getTime() < now.getTime() + 86400000) { //games in past 24 hours will still remain on top
        console.log(new Date(game.game_id.time), now)
        spliced.push(i)
        appended.push(game);
      }
    }

    spliced.forEach(element => {
      this.predictions.predictions[0].predictions.splice(element, 1);
    });

    for (let i = 0; i < appended.length; i++) {
      this.predictions.predictions[0].predictions.splice(spliced[i], 1);
      this.predictions.predictions[0].predictions.push(appended[i]);
      
    }


    for(let i = 0; i < this.predictions.predictions.length; i++) {
      this.numTournaments.push(i);
      this.predictions.predictions[i].predictions.forEach((element: any) => {
        element.game_id.hasStarted = now.getTime() > new Date(element.game_id.time).getTime();
        element.game_id.time = this.formatTime(new Date(element.game_id.time));
      })
    }
  }

  private sortPredictions(a: any, b: any): number {
    const aDate = new Date(a.game_id.time);
    const bDate = new Date(b.game_id.time);

    if (aDate.getTime() > bDate.getTime()) {
      return 1
    } else if (aDate.getTime() < bDate.getTime()) {
      return -1;
    } else {
      return 0;
    }
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
