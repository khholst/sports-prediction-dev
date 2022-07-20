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

  constructor(
    private predictionService: PredictionService
  ) { }

  ngOnInit(): void {
    this.getPredictions();
  }

  private async getPredictions() {
    this.predictions = await this.predictionService.getPredictions();
    

    for(let i = 0; i < this.predictions.predictions.length; i++) {
      this.numTournaments.push(i);
      this.predictions.predictions[i].predictions.forEach((element: any) => {
        element.game_id.time = this.formatTime(new Date(element.game_id.time));
      })
    }
  }

  formatTime(time: Date): string {
    return `${time.getDate() < 10 ? "0" + time.getDate(): time.getDate()}/${time.getMonth() < 10 ? "0" + time.getMonth(): time.getMonth()}/${time.getFullYear()}` ;
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
