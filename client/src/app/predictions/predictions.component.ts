import { Component, OnInit } from '@angular/core';
import { PredictionService } from '../prediction.service';

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.css']
})
export class PredictionsComponent implements OnInit {

  public active: number = 1;
  public predictions: any = {}
  public numTournaments: number[] = [];

  constructor(
    private predictionService: PredictionService
  ) { }

  ngOnInit(): void {
    this.getPredictions();
  }

  private async getPredictions() {
    const response: any = await this.predictionService.getPredictions();
    this.predictions = response;
    console.log(this.predictions)

    for(let i = 0; i < response.predictions.length; i++) {
      this.numTournaments.push(i)
    }
    console.log(this.numTournaments)
  }

}
