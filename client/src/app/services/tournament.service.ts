import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { Tournament } from '../models/tournament';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private tournamentUrl = "http://localhost:8080/api/admin/tournaments/new"

  constructor(
    private http: HttpClient
  ) { }


  async newPrediction(result: Tournament) {
    return await lastValueFrom(this.http.post(`${this.tournamentUrl}`, result, httpOptions));
  }
}
