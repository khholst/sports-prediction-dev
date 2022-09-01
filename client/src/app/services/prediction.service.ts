import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Prediction } from '../models/prediction';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private predictionsUrl = "https://sports-prediction-api.onrender.com/api/predictions";

  constructor(
    private http: HttpClient
  ) { }

  async getPredictions(): Promise<any> {
    return await lastValueFrom(this.http.get(this.predictionsUrl, httpOptions));
  }

  async newPrediction(prediction: Prediction) {
    return await lastValueFrom(this.http.post(`${this.predictionsUrl}/new`, prediction));
  }
}
