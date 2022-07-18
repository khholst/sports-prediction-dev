import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private predictionsUrl = "http://localhost:8080/api/predictions"

  constructor(
    private http: HttpClient
  ) { }

  async getPredictions() {
    return await lastValueFrom(this.http.get(this.predictionsUrl, httpOptions));
  }
}
