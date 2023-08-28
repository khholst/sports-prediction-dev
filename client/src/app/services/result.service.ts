import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Game } from '../models/games';
import { environment } from 'src/environments/environment';
import { Special } from '../models/special';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private resultsUrl: string = `${environment.serverUrl}/results`;
  private adminUrl: string = `${environment.serverUrl}/admin`;


  constructor(
    private http: HttpClient
  ) { }

  async newResult(result: Game) {
    return await lastValueFrom(this.http.post(`${this.resultsUrl}/save`, result));
  }

  async newSpecialResult(body: any, specialId: string, tournamentId: string) {
    return await lastValueFrom(this.http.post(`${this.adminUrl}/tournaments/${tournamentId}/specials/${specialId}/edit`, body));
  }
}
