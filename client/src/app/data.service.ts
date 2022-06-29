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
export class DataService {
  private dataUrl: string = "http://localhost:8080/data";

  constructor(private http: HttpClient) { };

  async getTournaments():Promise<any> {
    return await lastValueFrom(this.http.get(`${this.dataUrl}/tournaments`, httpOptions));
  };

  async getGames(tourID: number):Promise<any> {
    let params: HttpParams = new HttpParams().append('tournament_id', tourID);
    let headers = httpOptions.headers;
    return await lastValueFrom(this.http.get(`${this.dataUrl}/games`, {headers, params}));
  };

}
