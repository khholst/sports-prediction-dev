import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { Tournament } from '../models/tournament';
import { Game } from '../models/games';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};


@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private http: HttpClient
  ) { }

  async newGame(tournament_id: string, game: Game) {
    return await lastValueFrom(this.http.post(`https://sports-prediction-api.onrender.com/api/admin/tournaments/${tournament_id}/games/new`, game, httpOptions));
  }
}
