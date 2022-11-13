import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Game } from '../models/games';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private resultsUrl = "https://sports-prediction-api.onrender.com/api/results"
  private localUrl = "http://localhost:8080/api/results"

  constructor(
    private http: HttpClient
  ) { }

  async newResult(result: Game) {
    return await lastValueFrom(this.http.post(`${this.resultsUrl}/save`, result));
  }
}
