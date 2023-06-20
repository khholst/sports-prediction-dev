import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { Tournament } from '../models/tournament';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  //private tournamentUrl = "https://sports-prediction-api.onrender.com/api/admin/tournaments/new"
  private tournamentsUrl: string = `${environment.serverUrl}/admin/tournaments`

  constructor(
    private http: HttpClient
  ) { }


  async newTournament(tournament: Tournament) {
    return await lastValueFrom(this.http.post(`${this.tournamentsUrl}/new`, tournament, httpOptions));
  }
}
