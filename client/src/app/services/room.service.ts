import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Room } from '../models/room';
import { lastValueFrom } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomUrl = "https://sports-prediction-api.onrender.com/api/rooms"

  constructor(
    private http: HttpClient
  ) { }

  async createNewRoom(room: Room): Promise<any> {
    return await lastValueFrom(this.http.post(`${this.roomUrl}/new`, room, httpOptions));
  }


  async findRoomByKey(room_key: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.roomUrl}/${room_key}/joindata`, httpOptions));
  }


  async joinRoom(room_id: string): Promise<any> {
    return await lastValueFrom(this.http.post(`${this.roomUrl}/${room_id}/join`, httpOptions));
  }

  async getRooms(username: string):Promise<any> {
    return await lastValueFrom(this.http.get(`${this.roomUrl}/${username}/all`)); 
  };

  async getRoom(room_id: string):Promise<any> {
    return await lastValueFrom(this.http.get(`${this.roomUrl}/${room_id}`, httpOptions));
  };

  async getRoomUsers(roomID: Array<string>):Promise<any> {
    let params: HttpParams = new HttpParams().append('room', roomID.toString());
    let headers = httpOptions.headers;
    return await lastValueFrom(this.http.get(`${this.roomUrl}/members`, {headers, params}));
  };
}
