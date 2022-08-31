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
  private dataUrl: string = "https://sports-prediction-api.onrender.com/data";

  
  constructor(private http: HttpClient) { };

  async getTournaments(tourID?: string):Promise<any> {
    let params: HttpParams = new HttpParams();
    let headers = httpOptions.headers;
    if(tourID){
      params = params.append('_id', tourID);
    };
    return await lastValueFrom(this.http.get(`${this.dataUrl}/tournaments`, {headers, params}));
  };

  async getCountries():Promise<any> {
    return await lastValueFrom(this.http.get(`${this.dataUrl}/countries`, httpOptions));
  };

  async getGames(tourID: string):Promise<any> {
    let params: HttpParams = new HttpParams().append('tournament_id', tourID);
    let headers = httpOptions.headers;
    return await lastValueFrom(this.http.get(`${this.dataUrl}/games`, {headers, params}));
  };
}
