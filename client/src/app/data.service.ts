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

  async getTournaments(tourID?: string):Promise<any> {
    let params: HttpParams = new HttpParams();
    let headers = httpOptions.headers;
    if(tourID){
      params.append('_id', tourID);
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

  async getUserRooms(username: string):Promise<any> {
    let params: HttpParams = new HttpParams().append('username', username);
    let headers = httpOptions.headers;
    return await lastValueFrom(this.http.get(`${this.dataUrl}/userRooms`, {headers, params}));
  };

  async getRooms(roomIDs: Array<string>):Promise<any> {
    let params: HttpParams = new HttpParams().append('room_id', roomIDs.toString());
    let headers = httpOptions.headers;
    return await lastValueFrom(this.http.get(`${this.dataUrl}/rooms`, {headers, params}));    
  };

  async getRoomsUsers(roomID: string):Promise<any> {
    let params: HttpParams = new HttpParams().append('room', roomID);
    let headers = httpOptions.headers;
    return await lastValueFrom(this.http.get(`${this.dataUrl}/roomUsers`, {headers, params}));    
  };

}
