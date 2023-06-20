import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { Tournament } from '../models/tournament';
import { Game } from '../models/games';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};


@Injectable({
  providedIn: 'root'
})
export class GameService {
  private adminUrl: string = `${environment.serverUrl}/admin`;
  constructor(
    private http: HttpClient
  ) { }

  async newGame(tournament_id: string, game: Game) {
    let newGameUrl = `${this.adminUrl}/tournaments/${tournament_id}/games/new`;
    return await lastValueFrom(this.http.post(newGameUrl, game, httpOptions));
  }
}
