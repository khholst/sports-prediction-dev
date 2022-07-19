import { Component, OnInit } from '@angular/core';
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

}
